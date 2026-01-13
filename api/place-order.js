import { createClient } from '@supabase/supabase-js';

export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { orderDetails } = req.body;

    try {
        // 1. Descontar Stock (Lógica de servidor para evitar trampas)
        for (const item of orderDetails.items) {
            const { data: prod } = await supabase.from('products').select('stock').eq('id', item.id).single();
            await supabase.from('products').update({ stock: prod.stock - item.qty }).eq('id', item.id);
        }

        // 2. Insertar Orden
        const { error } = await supabase.from('orders').insert([{
            customer_name: orderDetails.name,
            customer_address: orderDetails.address,
            payment_method: orderDetails.payment,
            total_amount: orderDetails.total,
            order_items: orderDetails.items
        }]);

        if (error) throw error;
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
