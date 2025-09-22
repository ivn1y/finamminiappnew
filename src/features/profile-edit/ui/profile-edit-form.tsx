'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/shared/types/app';
import { useProfile } from '@/shared/hooks/use-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Loader2, Save, RefreshCw, AlertCircle } from 'lucide-react';

interface ProfileEditFormProps {
  user: User;
  onSave?: (updatedUser: User) => void;
  onCancel?: () => void;
  className?: string;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSave,
  onCancel,
  className
}) => {
  const { updateProfile, isLoading, error, isUpdating, clearError } = useProfile();
  const [formData, setFormData] = useState({
    name: user.name || '',
    intent7d: user.intent7d || '',
    profile: user.profile || {}
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Отслеживаем изменения
  useEffect(() => {
    const hasNameChanged = formData.name !== (user.name || '');
    const hasIntentChanged = formData.intent7d !== (user.intent7d || '');
    const hasProfileChanged = JSON.stringify(formData.profile) !== JSON.stringify(user.profile || {});
    
    setHasChanges(hasNameChanged || hasIntentChanged || hasProfileChanged);
  }, [formData, user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    clearError();
  };

  const handleProfileChange = (role: UserRole, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [role]: {
          ...prev.profile[role as keyof typeof prev.profile],
          [field]: value
        }
      }
    }));
    clearError();
  };

  const handleSave = async () => {
    const updates = {
      name: formData.name,
      intent7d: formData.intent7d,
      profile: formData.profile
    };

    const success = await updateProfile(updates);
    if (success && onSave) {
      onSave({ ...user, ...updates });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      intent7d: user.intent7d || '',
      profile: user.profile || {}
    });
    clearError();
    if (onCancel) {
      onCancel();
    }
  };

  const renderRoleSpecificFields = () => {
    if (!user.role) return null;

    const roleProfile = formData.profile[user.role as keyof typeof formData.profile] || {};

    switch (user.role) {
      case 'trader':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Профиль трейдера</h3>
            
            <div>
              <Label htmlFor="trader-years" className="text-sm font-medium text-gray-700">
                Опыт трейдинга (лет)
              </Label>
              <Input
                id="trader-years"
                type="number"
                min="0"
                max="50"
                // так не делаем
                value={(roleProfile as { years?: number })?.years || ''}
                onChange={(e) => handleProfileChange('trader', 'years', parseInt(e.target.value) || 0)}
                placeholder="Введите количество лет"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="trader-risk" className="text-sm font-medium text-gray-700">
                Уровень риска
              </Label>
              <Select
                value={(roleProfile as { risk?: string })?.risk || ''}
                onValueChange={(value) => handleProfileChange('trader', 'risk', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Выберите уровень риска" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trader-markets" className="text-sm font-medium text-gray-700">
                Рынки (через запятую)
              </Label>
              <Input
                id="trader-markets"
                type="text"
                value={"markets" in roleProfile && Array.isArray(roleProfile?.markets) ? roleProfile?.markets.join(', ') : ''}
                onChange={(e) => handleProfileChange('trader', 'markets', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="forex, crypto, stocks"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'startup':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Профиль стартапа</h3>
            
            <div>
              <Label htmlFor="startup-stage" className="text-sm font-medium text-gray-700">
                Стадия проекта
              </Label>
              <Select
                value={(roleProfile as { stage?: string })?.stage || ''}
                onValueChange={(value) => handleProfileChange('startup', 'stage', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Выберите стадию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Идея</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="PMF">Product-Market Fit</SelectItem>
                  <SelectItem value="Scale">Масштабирование</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startup-pitch" className="text-sm font-medium text-gray-700">
                Питч в 3 слова
              </Label>
              <Input
                id="startup-pitch"
                type="text"
                maxLength={100}
                value={(roleProfile as { pitch3?: string })?.pitch3 || ''}
                onChange={(e) => handleProfileChange('startup', 'pitch3', e.target.value)}
                placeholder="Опишите проект тремя словами"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="startup-site" className="text-sm font-medium text-gray-700">
                Сайт проекта
              </Label>
              <Input
                id="startup-site"
                type="url"
                value={(roleProfile as { site?: string })?.site || ''}
                onChange={(e) => handleProfileChange('startup', 'site', e.target.value)}
                placeholder="https://example.com"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'expert':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Профиль эксперта</h3>
            
            <div>
              <Label htmlFor="expert-domain" className="text-sm font-medium text-gray-700">
                Область экспертизы
              </Label>
              <Input
                id="expert-domain"
                type="text"
                value={(roleProfile as { domain?: string })?.domain || ''}
                onChange={(e) => handleProfileChange('expert', 'domain', e.target.value)}
                placeholder="Финансы, технологии, маркетинг..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="expert-availability" className="text-sm font-medium text-gray-700">
                Доступность (часов в неделю)
              </Label>
              <Input
                id="expert-availability"
                type="number"
                min="0"
                max="40"
                value={(roleProfile as { availabilityHrs?: number })?.availabilityHrs || ''}
                onChange={(e) => handleProfileChange('expert', 'availabilityHrs', parseInt(e.target.value) || 0)}
                placeholder="Введите количество часов"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="expert-mode" className="text-sm font-medium text-gray-700">
                Режим работы
              </Label>
              <Select
                value={(roleProfile as { mode?: string })?.mode || ''}
                onValueChange={(value) => handleProfileChange('expert', 'mode', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Выберите режим" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentor">Ментор</SelectItem>
                  <SelectItem value="tracker">Трекер</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'partner':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Профиль партнёра</h3>
            
            <div>
              <Label htmlFor="partner-type" className="text-sm font-medium text-gray-700">
                Тип партнёра
              </Label>
              <Select
                value={(roleProfile as { type?: string })?.type || ''}
                onValueChange={(value) => handleProfileChange('partner', 'type', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="university">Университет</SelectItem>
                  <SelectItem value="business">Бизнес</SelectItem>
                  <SelectItem value="media">Медиа</SelectItem>
                  <SelectItem value="franchise">Франшиза</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="partner-interest" className="text-sm font-medium text-gray-700">
                Область интереса
              </Label>
              <Select
                value={(roleProfile as { interest?: string })?.interest || ''}
                onValueChange={(value) => handleProfileChange('partner', 'interest', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Выберите интерес" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white-label">White-label</SelectItem>
                  <SelectItem value="franchise">Франшиза</SelectItem>
                  <SelectItem value="api">API интеграция</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Редактирование профиля</span>
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Есть изменения
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Основные поля */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Основная информация</h3>
            
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Имя
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Введите ваше имя"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="intent7d" className="text-sm font-medium text-gray-700">
                Цель на 7 дней
              </Label>
              <Textarea
                id="intent7d"
                value={formData.intent7d}
                onChange={(e) => handleInputChange('intent7d', e.target.value)}
                placeholder="Опишите вашу цель на ближайшие 7 дней"
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          {/* Поля по ролям */}
          {renderRoleSpecificFields()}

          {/* Кнопки действий */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
              className="flex-1"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
