<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_type'); // 'product_added', 'transfer', 'recuperation'
            $table->string('product_name');
            $table->integer('quantity');
            $table->string('unite')->nullable();
            $table->string('destination')->nullable(); // For transfers
            $table->string('personnel')->nullable(); // For transfers
            $table->string('type_transfert')->nullable(); // For transfers
            $table->unsignedBigInteger('reference_id'); // ID of the original record
            $table->string('reference_type'); // Model class name
            $table->datetime('transaction_date');
            $table->json('additional_data')->nullable(); // For storing extra information
            $table->timestamps();
            
            $table->index(['transaction_type', 'transaction_date']);
            $table->index('reference_id');
        });
        Schema::table('statistics', function (Blueprint $table) {
            $table->decimal('prix_unitaire', 12, 2)->nullable()->after('quantity');
            $table->decimal('prix_total', 14, 2)->nullable()->after('prix_unitaire');
        });
        Schema::table('statistics', function (Blueprint $table) {
            $table->string('envoyeur')->nullable()->after('personnel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            $table->dropColumn(['prix_unitaire', 'prix_total']);
            $table->dropColumn('envoyeur');
        });
        Schema::dropIfExists('statistics');
    }
};

