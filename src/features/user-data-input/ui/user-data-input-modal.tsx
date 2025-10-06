'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { X, User, Mail, Phone, MapPin, Briefcase, Target } from 'lucide-react';

interface UserDataInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserData) => void;
  initialData?: Partial<UserData>;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  goals: string;
  interests: string;
}

export const UserDataInputModal: React.FC<UserDataInputModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<UserData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    position: initialData.position || '',
    location: initialData.location || '',
    goals: initialData.goals || '',
    interests: initialData.interests || '',
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    }

    if (!formData.goals.trim()) {
      newErrors.goals = 'Цели обязательны для заполнения';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      company: initialData.company || '',
      position: initialData.position || '',
      location: initialData.location || '',
      goals: initialData.goals || '',
      interests: initialData.interests || '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 rounded-none p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              <DialogTitle className="text-2xl font-semibold">
                Заполните ваши данные
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Расскажите о себе, чтобы мы могли лучше подобрать для вас контент и возможности
          </p>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Основная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Имя и фамилия *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Введите ваше имя и фамилию"
                      className="mt-2"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Телефон *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+7 (999) 123-45-67"
                      className="mt-2"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                      Город
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Москва"
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Профессиональная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  Профессиональная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Компания
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Название вашей компании"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                      Должность
                    </Label>
                    <Input
                      id="position"
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Ваша должность"
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Цели и интересы */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Цели и интересы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goals" className="text-sm font-medium text-gray-700">
                    Ваши цели на мероприятии *
                  </Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    placeholder="Опишите, что вы хотите получить от участия в мероприятии..."
                    className="mt-2"
                    rows={4}
                  />
                  {errors.goals && (
                    <p className="text-red-500 text-sm mt-1">{errors.goals}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="interests" className="text-sm font-medium text-gray-700">
                    Области интересов
                  </Label>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="Какие темы вас интересуют? (финансы, инвестиции, стартапы, технологии...)"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer с кнопками */}
        <div className="p-6 border-t bg-white flex-shrink-0">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Сохранить данные
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
