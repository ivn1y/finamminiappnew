'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/shared/store/app-store';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Edit3,
  Plus,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';

interface GoalProgressTrackerProps {
  onEditGoal?: () => void;
  className?: string;
}

export const GoalProgressTracker: React.FC<GoalProgressTrackerProps> = ({ 
  onEditGoal,
  className = ''
}) => {
  const { user, updateUser } = useAppStore();
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressNote, setProgressNote] = useState('');

  if (!user || !user.intent7d) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Цель не выбрана
          </h3>
          <p className="text-gray-600 mb-4">
            Выбери цель на 7 дней, чтобы начать отслеживать прогресс
          </p>
          <Button onClick={onEditGoal} variant="outline">
            Выбрать цель
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Мокаем данные прогресса (в реальном приложении это будет приходить с сервера)
  const goalProgress = user.goalProgress || {
    current: 0,
    target: 100,
    daysLeft: 7,
    notes: [],
    milestones: [
      { id: 1, title: 'Начало работы', completed: true, date: '2024-01-01' },
      { id: 2, title: 'Первый результат', completed: false, date: null },
      { id: 3, title: 'Промежуточная проверка', completed: false, date: null },
      { id: 4, title: 'Завершение цели', completed: false, date: null }
    ]
  };

  const progressPercentage = Math.round((goalProgress.current / goalProgress.target) * 100);

  const handleAddProgress = () => {
    setShowProgressModal(true);
  };

  const handleSaveProgress = () => {
    if (progressNote.trim()) {
      // Здесь будет логика сохранения прогресса
      const newNote = {
        id: Date.now(),
        text: progressNote,
        date: new Date().toISOString(),
        progress: Math.min(goalProgress.current + 10, goalProgress.target)
      };
      
      // Обновляем прогресс пользователя
      updateUser({
        goalProgress: {
          ...goalProgress,
          current: newNote.progress,
          notes: [...goalProgress.notes, newNote]
        }
      });
      
      setProgressNote('');
      setShowProgressModal(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressText = (percentage: number) => {
    if (percentage < 30) return 'Начальный этап';
    if (percentage < 70) return 'В процессе';
    return 'Почти готово!';
  };

  return (
    <div className={className}>
      {/* Main Progress Card */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Цель на 7 дней</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditGoal}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Goal Text */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium">{user.intent7d}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Прогресс: {goalProgress.current}/{goalProgress.target}
                </span>
                <Badge variant="outline" className="text-xs">
                  {progressPercentage}%
                </Badge>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{getProgressText(progressPercentage)}</span>
                <span>{goalProgress.daysLeft} дней осталось</span>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleAddProgress}
              className="w-full"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить прогресс
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Этапы выполнения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {goalProgress.milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  milestone.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    milestone.completed ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {milestone.title}
                  </p>
                  {milestone.date && (
                    <p className="text-xs text-gray-500">
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {milestone.completed && (
                  <Badge variant="secondary" className="text-xs">
                    Выполнено
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Notes */}
      {goalProgress.notes.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Заметки о прогрессе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goalProgress.notes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

          {/* Add Progress Modal */}
          <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Добавить прогресс
                </DialogTitle>
              </DialogHeader>
          
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="progress-note" className="text-sm font-medium text-gray-700">
                Что удалось сделать?
              </Label>
              <Textarea
                id="progress-note"
                value={progressNote}
                onChange={(e) => setProgressNote(e.target.value)}
                placeholder="Опиши свой прогресс..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowProgressModal(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveProgress}
              disabled={!progressNote.trim()}
              className="flex-1"
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
