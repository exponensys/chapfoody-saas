import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Clock, Save, Plus, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  dayLabel: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface ReservationType {
  id: string;
  name: string;
  color: string;
  active: boolean;
}

interface AvailabilityDaysViewProps {
  onBack: () => void;
}

export function AvailabilityDaysView({ onBack }: AvailabilityDaysViewProps) {
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([
    { id: "1", name: "Sur place", color: "#28a745", active: true },
    { id: "2", name: "Livraison", color: "#007bff", active: true },
    { id: "3", name: "À emporter", color: "#ffc107", active: true },
    { id: "4", name: "Événement", color: "#6f42c1", active: false }
  ]);

  const [availability, setAvailability] = useState<DayAvailability[]>([
    {
      day: "lundi",
      dayLabel: "Lundi",
      enabled: true,
      timeSlots: [
        { id: "1", start: "11:00", end: "14:00" },
        { id: "2", start: "18:00", end: "22:00" }
      ]
    },
    {
      day: "mardi", 
      dayLabel: "Mardi",
      enabled: true,
      timeSlots: [
        { id: "3", start: "11:00", end: "14:00" },
        { id: "4", start: "18:00", end: "22:00" }
      ]
    },
    {
      day: "mercredi",
      dayLabel: "Mercredi", 
      enabled: true,
      timeSlots: [
        { id: "5", start: "11:00", end: "14:00" },
        { id: "6", start: "18:00", end: "22:00" }
      ]
    },
    {
      day: "jeudi",
      dayLabel: "Jeudi",
      enabled: true,
      timeSlots: [
        { id: "7", start: "11:00", end: "14:00" },
        { id: "8", start: "18:00", end: "22:00" }
      ]
    },
    {
      day: "vendredi",
      dayLabel: "Vendredi",
      enabled: true,
      timeSlots: [
        { id: "9", start: "11:00", end: "14:00" },
        { id: "10", start: "18:00", end: "23:00" }
      ]
    },
    {
      day: "samedi",
      dayLabel: "Samedi",
      enabled: true,
      timeSlots: [
        { id: "11", start: "11:00", end: "15:00" },
        { id: "12", start: "18:00", end: "23:00" }
      ]
    },
    {
      day: "dimanche",
      dayLabel: "Dimanche",
      enabled: false,
      timeSlots: []
    }
  ]);

  const toggleDayEnabled = (dayIndex: number) => {
    setAvailability(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, enabled: !day.enabled, timeSlots: !day.enabled ? [] : day.timeSlots }
        : day
    ));
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? {
            ...day,
            timeSlots: day.timeSlots.map((slot, sIndex) => 
              sIndex === slotIndex 
                ? { ...slot, [field]: value }
                : slot
            )
          }
        : day
    ));
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: "09:00",
      end: "17:00"
    };
    
    setAvailability(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, timeSlots: [...day.timeSlots, newSlot] }
        : day
    ));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailability(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? { ...day, timeSlots: day.timeSlots.filter((_, sIndex) => sIndex !== slotIndex) }
        : day
    ));
  };

  const toggleReservationType = (typeId: string) => {
    setReservationTypes(prev => prev.map(type =>
      type.id === typeId ? { ...type, active: !type.active } : type
    ));
  };

  const handleSave = () => {
    console.log("Jours de disponibilité sauvegardés:", availability);
    console.log("Types de réservation:", reservationTypes);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          ← Retour
        </Button>
        <h1 className="text-2xl font-semibold">Jours de disponibilité</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Planning des jours */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#b70f23]" />
                Planning hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availability.map((day, dayIndex) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Checkbox
                        id={`day-${day.day}`}
                        checked={day.enabled}
                        onCheckedChange={() => toggleDayEnabled(dayIndex)}
                      />
                      <Label 
                        htmlFor={`day-${day.day}`}
                        className="text-lg font-medium min-w-[100px]"
                      >
                        {day.dayLabel}
                      </Label>
                    </div>

                    {day.enabled && (
                      <div className="ml-8 space-y-2">
                        {day.timeSlots.map((slot, slotIndex) => (
                          <div key={slot.id} className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <Label className="text-sm">Début de service:</Label>
                              <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                                className="w-32"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Fin de service:</Label>
                              <Input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                                className="w-32"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(dayIndex)}
                          className="mt-2 text-[#b70f23] border-[#b70f23] hover:bg-[#b70f23] hover:text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un créneau
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Types de réservation */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Types de réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reservationTypes.map((type) => (
                  <div key={type.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={type.active}
                      onCheckedChange={() => toggleReservationType(type.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <Label 
                        htmlFor={`type-${type.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {type.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">Actions rapides</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setAvailability(prev => prev.map(day => ({
                        ...day,
                        enabled: true,
                        timeSlots: day.timeSlots.length === 0 ? [
                          { id: Date.now().toString(), start: "09:00", end: "17:00" }
                        ] : day.timeSlots
                      })));
                    }}
                  >
                    Activer tous les jours
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setAvailability(prev => prev.map(day => ({
                        ...day,
                        enabled: false,
                        timeSlots: []
                      })));
                    }}
                  >
                    Désactiver tous les jours
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-[#b70f23] hover:bg-[#70070e] text-white px-8 py-3 text-lg flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Sauvegarder la mise à jour
        </Button>
      </div>
    </div>
  );
}