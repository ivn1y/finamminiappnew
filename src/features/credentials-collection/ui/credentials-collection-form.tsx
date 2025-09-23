'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Phone, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { User } from '@/shared/types/app';

interface CredentialsCollectionFormProps {
  user: User;
  onSave: (credentials: { phone?: string; password?: string }) => void;
  isLoading?: boolean;
}

export const CredentialsCollectionForm: React.FC<CredentialsCollectionFormProps> = ({
  user,
  onSave,
  isLoading = false
}) => {
  const [phone, setPhone] = useState(user.credentials?.phone || '');
  const [password, setPassword] = useState(user.credentials?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave({ phone, password });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPhone(user.credentials?.phone || '');
    setPassword(user.credentials?.password || '');
    setIsEditing(false);
  };

  const hasCredentials = user.credentials?.phone || user.credentials?.password;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <span>Учетные данные</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-3">
            {hasCredentials ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Телефон:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.credentials?.phone ? 
                        `${user.credentials.phone.slice(0, 3)}***${user.credentials.phone.slice(-2)}` : 
                        'Не указан'
                      }
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Пароль:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.credentials?.password ? '••••••••' : 'Не указан'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Учетные данные не указаны. Нажмите "Редактировать" для добавления.
              </p>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              {hasCredentials ? 'Редактировать' : 'Добавить данные'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Номер телефона
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Пароль
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-1" />
                Сохранить
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
