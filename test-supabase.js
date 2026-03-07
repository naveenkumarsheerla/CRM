/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = "https://njwtshjzkzqenqgniglz.supabase.co";
const supabaseKey = "sb_publishable_lbbxOWXSA5kKbP-jTImGig_5LTq6HFC";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLeads() {
    console.log('Testing connection to Supabase...');
    const { data: users, error: userError } = await supabase.from('users').select('count');
    if (userError) {
        console.error('Error fetching users:', userError.message);
    } else {
        console.log('Users table exists. Count:', users);
    }

    const { data: leads, error: leadError } = await supabase.from('leads').select('*');
    if (leadError) {
        console.error('Error fetching leads:', leadError.message);
    } else {
        console.log('Leads table exists. Data:', leads);
    }
}

testLeads();
