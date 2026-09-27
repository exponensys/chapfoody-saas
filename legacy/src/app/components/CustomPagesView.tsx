import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ResponsiveContainer, ResponsiveGrid } from './ResponsiveGrid';
import { ArrowLeft, FileCode, Plus, Edit, Settings } from "lucide-react";

interface CustomPagesViewProps {
  onBack: () => void;
}

export function CustomPagesView({ onBack }: CustomPagesViewProps) {
  return (
    <ResponsiveContainer maxWidth="6xl" className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-medium text-[#b70f23]">
              Custom Pages
            </h2>
            <p className="text-muted-foreground">
              Créez et gérez vos pages personnalisées
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button className="bg-[#f4b71b] hover:bg-[#e6a516] text-black gap-2 flex-1 sm:flex-none">
            <Plus className="w-4 h-4" />
            Nouvelle page
          </Button>
          <Button className="bg-[#b70f23] hover:bg-[#70070e] text-white gap-2 flex-1 sm:flex-none">
            <Settings className="w-4 h-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#b70f23]" />
            Gestion des pages personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <FileCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Section Custom Pages
              </h3>
              <p className="text-gray-500 mb-4">
                Cette section sera configurée selon vos spécifications
              </p>
              <div className="text-sm text-gray-400">
                En attente des informations détaillées pour l'implémentation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
}