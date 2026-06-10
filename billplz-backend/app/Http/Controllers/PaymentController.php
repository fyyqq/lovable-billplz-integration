<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {

        // Validate the incoming request data
        $request->validate([
            'user_id' => 'required',
            'amount' => 'required|numeric',
            'purpose' => 'required|string',
            'email' => 'required|email',
            'name' => 'required|string',
        ]);

        $referenceId = 'TXN-' . strtoupper(Str::random(10));

        $response = Http::withBasicAuth(config('services.billplz.api_key'), '')
        ->post('https://www.billplz-sandbox.com/api/v3/bills', [
            'collection_id' => config('services.billplz.collection_id'),
            'email' => $request->email,
            'name' => $request->name,
            'amount' => $request->amount * 100, // Billplz guna sen (RM1.00 = 100)
            // 'callback_url' => route('billplz.webhook'), // URL untuk Billplz hantar status bayaran
            'callback_url' => 'https://669a-2001-e68-542f-a9d6-568-c683-8f4d-9514.ngrok-free.app/api/billplz-webhook', // URL untuk Billplz hantar status bayaran
            'redirect_url' => 'http://localhost:8080/payment-success', // URL untuk tolak user balik ke React
            'description' => $request->purpose,
            'reference_1_label' => 'Reference ID',
            'reference_1' => $referenceId
        ]);


        if ($response->successful()) {
            $bill = $response->json();

            // Simpan rekod awal ke dalam database dengan status 'pending'
            // Ubah kod ini mengikut cara model anda jika perlu
            DB::table('payments')->insert([
                'user_id' => $request->user_id,
                'reference_id' => $referenceId,
                'billplz_id' => $bill['id'],
                'amount' => $request->amount,
                'purpose' => $request->purpose,
                'status' => 'pending',
                'url' => $bill['url'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Pulangkan URL Billplz ke React
            return response()->json(['url' => $bill['url']], 200);
        }

        return response()->json(['error' => 'Failed to create Billplz bill'], 500);
    }

    public function handleWebhook(Request $request)
    {
        $billplzId = $request->input('id');
        $status = $request->input('paid') === 'true' ? 'paid' : 'failed';
        $paidAmount = $request->input('amount'); // Tukar sen balik kepada RM
        $paidAmount = $paidAmount / 100;
        $paidAt = Carbon::parse($request->input('paid_at'))->toDateTimeString();

        // Cari rekod bayaran berdasarkan billplz_id
        $payment = DB::table('payments')->where('billplz_id', $billplzId)->first();

        if ($payment) {
            Log::info([$payment->amount, number_format($paidAmount, 2, '.', ''), $request->all()]); // Log data webhook untuk debugging
            // Keselamatan SaaS: Sahkan jumlah amaun adalah sama
            if ($payment->amount === number_format($paidAmount, 2, '.', '') && $status === 'paid') {
                DB::table('payments')->where('billplz_id', $billplzId)->update([
                    'status' => 'paid',
                    'fixed_amount' => $paidAmount,
                    'paid_at' => $paidAt,
                    'webhook_responses' => json_encode($request->all()), // Simpan raw audit log
                    'updated_at' => now(),
                ]);

                // 💡 TIP: Anda boleh tambah kod di sini untuk aktifkan pelan premium user (cth: kemas kini table users)
            } else {
                DB::table('payments')->where('billplz_id', $billplzId)->update([
                    'status' => 'failed',
                    'webhook_responses' => json_encode($request->all()),
                    'updated_at' => now(),
                ]);
            }
        }

        return response('OK', 200);
    }
}
