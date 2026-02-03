import { UserRole } from '@/shared/types/app';

export interface CRMData {
  name: string;
  email: string;
  phone: string;
  role: UserRole | null;
  roleHistory: Array<{ role: UserRole; timestamp: string }>;
  company?: string;
  position?: string;
  goals?: string;
  interests?: string;
}

/**
 * Отправляет данные пользователя в CRM систему
 * @param data Данные пользователя для отправки в CRM
 * @returns Promise с результатом отправки
 */
export async function sendToCRM(data: CRMData): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Заменить на реальный URL API CRM
    const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || '/api/crm/submit';
    
    const response = await fetch(CRM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        roleHistory: data.roleHistory,
        company: data.company,
        position: data.position,
        goals: data.goals,
        interests: data.interests,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CRM API Error:', errorText);
      return { success: false, error: `Ошибка отправки данных: ${response.status}` };
    }

    const result = await response.json();
    console.log('Data sent to CRM successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Error sending data to CRM:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка при отправке данных' 
    };
  }
}
