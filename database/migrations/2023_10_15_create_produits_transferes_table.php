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
        Schema::create('produits_transferes', function (Blueprint $table) {
            $table->id();
            $table->string('produit_id'); // Using product name as identifier
            $table->integer('quantite');
            $table->string('destination');
            $table->enum('type_transfert', ['interne', 'externe']);
            $table->string('nom_personnel')->nullable();
            $table->timestamp('date_transfert')->useCurrent();
            
            // Additional fields from Produit model
            $table->string('unite')->nullable();
            $table->string('type_produit')->nullable();
            $table->string('marque')->nullable();
            $table->string('dosage')->nullable();
            $table->string('image_url')->nullable();
            
            $table->decimal('prix_unitaire', 12, 2)->nullable();
            $table->decimal('prix_total', 12, 2)->nullable();
            
            $table->timestamps();
        });
        
        Schema::table('statistics', function (Blueprint $table) {
            if (!Schema::hasColumn('statistics', 'prix_unitaire')) {
                $table->decimal('prix_unitaire', 12, 2)->nullable();
            }
            if (!Schema::hasColumn('statistics', 'prix_total')) {
                $table->decimal('prix_total', 14, 2)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            if (Schema::hasColumn('statistics', 'prix_unitaire')) {
                $table->dropColumn('prix_unitaire');
            }
            if (Schema::hasColumn('statistics', 'prix_total')) {
                $table->dropColumn('prix_total');
            }
        });
        
        Schema::dropIfExists('produits_transferes');
    }
};