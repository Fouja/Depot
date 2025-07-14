<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bon_id')->constrained('bons_de_receptions');
            $table->string('nom');
            $table->integer('quantite');
            $table->string('unite');
            $table->string('type');
            
            // REMOVE THIS LINE
            // $table->string('envoyeur');  // Added missing field
            $table->string('dosage')->nullable();
            $table->date('peremption')->nullable();
            $table->string('marque')->nullable();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->decimal('prix_unitaire', 12, 2)->default(0);
            $table->decimal('prix_total', 12, 2)->default(0);
            $table->timestamps();
        });
        
    }

    public function down()
    {
        Schema::dropIfExists('produits');
    }
};