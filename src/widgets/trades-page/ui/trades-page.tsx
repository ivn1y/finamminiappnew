"use client";

import { useState, useEffect } from "react";
import { useTelegram } from "@/shared/lib/telegram/providers/telegram-provider";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
// import { GameMenu } from "@/widgets/game-menu"; // Temporarily disabled

interface TradeOffer {
  id: string;
  user_name: string;
  user_id: string;
  card_name: string;
  card_rarity: string;
  wanted_card: string;
  wanted_rarity: string;
  image_url?: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface UserCard {
  id: string;
  name: string;
  rarity: string;
  image_url?: string;
  count: number;
}

const rarityColors = {
  'classic': 'bg-orange-500',
  'rare': 'bg-green-500',
  'epic': 'bg-purple-500', 
  'legendary': 'bg-orange-400',
  'stock': 'bg-blue-500'
};

export function TradesPage() {
  const { webApp, telegramUser: user, isReady } = useTelegram();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-trades' | 'create'>('browse');
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [myTrades, setMyTrades] = useState<TradeOffer[]>([]);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Создание нового обмена
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [wantedCard, setWantedCard] = useState<string>('');
  const [wantedRarity, setWantedRarity] = useState<string>('');

  const loadTradeOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/get_trade_offers', {
        headers: {
          'X-Telegram-Init-Data': webApp?.initData || ''
        }
      });

      if (!response.ok) throw new Error('Failed to load trade offers');
      
      const data = await response.json();
      setTradeOffers(data.offers || []);
    } catch (error) {
      console.error('Error loading trade offers:', error);
      webApp?.showAlert('Ошибка загрузки предложений обмена');
    } finally {
      setLoading(false);
    }
  };

  const loadMyTrades = async () => {
    setLoading(true);
    try {
      const response = await fetch('/get_my_trades', {
        headers: {
          'X-Telegram-Init-Data': webApp?.initData || ''
        }
      });

      if (!response.ok) throw new Error('Failed to load my trades');
      
      const data = await response.json();
      setMyTrades(data.trades || []);
    } catch (error) {
      console.error('Error loading my trades:', error);
      webApp?.showAlert('Ошибка загрузки моих обменов');
    } finally {
      setLoading(false);
    }
  };

  const loadUserCards = async () => {
    try {
      const response = await fetch('/get_user_cards', {
        headers: {
          'X-Telegram-Init-Data': webApp?.initData || ''
        }
      });

      if (!response.ok) throw new Error('Failed to load user cards');
      
      const data = await response.json();
      setUserCards(data.cards || []);
    } catch (error) {
      console.error('Error loading user cards:', error);
    }
  };

  const createTradeOffer = async () => {
    if (!selectedCard || !wantedCard || !wantedRarity) {
      webApp?.showAlert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('/create_trade_offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': webApp?.initData || ''
        },
        body: JSON.stringify({
          card_id: selectedCard,
          wanted_card: wantedCard,
          wanted_rarity: wantedRarity
        })
      });

      if (!response.ok) throw new Error('Failed to create trade offer');
      
      const result = await response.json();
      webApp?.showAlert(result.message || 'Предложение обмена создано');
      
      // Очищаем форму и обновляем данные
      setSelectedCard('');
      setWantedCard('');
      setWantedRarity('');
      setActiveTab('my-trades');
      await loadMyTrades();
    } catch (error) {
      console.error('Error creating trade offer:', error);
      webApp?.showAlert('Ошибка создания предложения обмена');
    }
  };

  const acceptTrade = async (tradeId: string) => {
    try {
      const response = await fetch('/accept_trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': webApp?.initData || ''
        },
        body: JSON.stringify({ trade_id: tradeId })
      });

      if (!response.ok) throw new Error('Failed to accept trade');
      
      const result = await response.json();
      webApp?.showAlert(result.message || 'Обмен принят');
      await loadTradeOffers();
    } catch (error) {
      console.error('Error accepting trade:', error);
      webApp?.showAlert('Ошибка принятия обмена');
    }
  };

  useEffect(() => {
    if (isReady) {
      loadTradeOffers();
      loadUserCards();
    }
  }, [isReady]);

  useEffect(() => {
    if (activeTab === 'my-trades' && isReady) {
      loadMyTrades();
    }
  }, [activeTab, isReady]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#efeff3)] text-[var(--tg-theme-text-color,#222)]">
      <div className="flex flex-col h-screen max-h-[var(--tg-viewport-height,100vh)]">
        <div className="flex-1 overflow-y-auto p-4 pb-20">
          <h1 className="text-2xl font-bold mb-6 text-[var(--tg-theme-text-color,#222)]">
            Обмен картами
          </h1>

          {/* Табы */}
          <div className="flex mb-6 bg-[var(--tg-theme-secondary-bg-color,#f4f4f4)] rounded-lg p-1">
            <Button
              variant={activeTab === 'browse' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('browse')}
            >
              Обзор
            </Button>
            <Button
              variant={activeTab === 'my-trades' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('my-trades')}
            >
              Мои обмены
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveTab('create')}
            >
              Создать
            </Button>
          </div>

          {/* Обзор предложений */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Загрузка предложений...</p>
                </div>
              ) : tradeOffers.length === 0 ? (
                <div className="text-center py-12 text-[var(--tg-theme-hint-color,#999)]">
                  <div className="text-4xl mb-4">🔄</div>
                  <p>Нет активных предложений обмена</p>
                </div>
              ) : (
                tradeOffers.map((offer) => (
                  <Card key={offer.id} className="bg-white border-none shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          {offer.image_url ? (
                            <img src={offer.image_url} alt={offer.card_name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-2xl">🎴</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{offer.user_name}</div>
                          <div className="text-xs text-[var(--tg-theme-hint-color,#999)] mb-2">
                            ID: {offer.user_id}
                          </div>
                          
                          <div className="mb-2">
                            <div className="text-sm font-medium mb-1">Предлагает:</div>
                            <div className="text-sm">{offer.card_name}</div>
                            <Badge className={`text-xs text-white mt-1 ${rarityColors[offer.card_rarity as keyof typeof rarityColors] || 'bg-gray-500'}`}>
                              {offer.card_rarity}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Хочет:</div>
                            <div className="text-sm">{offer.wanted_card}</div>
                            <Badge className={`text-xs text-white mt-1 ${rarityColors[offer.wanted_rarity as keyof typeof rarityColors] || 'bg-gray-500'}`}>
                              {offer.wanted_rarity}
                            </Badge>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => acceptTrade(offer.id)}
                            className="w-full bg-[var(--tg-theme-button-color,#5bc8fb)] text-[var(--tg-theme-button-text-color,#fff)]"
                          >
                            Принять обмен
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Мои обмены */}
          {activeTab === 'my-trades' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Загрузка моих обменов...</p>
                </div>
              ) : myTrades.length === 0 ? (
                <div className="text-center py-12 text-[var(--tg-theme-hint-color,#999)]">
                  <div className="text-4xl mb-4">📝</div>
                  <p>У вас нет активных обменов</p>
                </div>
              ) : (
                myTrades.map((trade) => (
                  <Card key={trade.id} className="bg-white border-none shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium">Мой обмен</div>
                        <Badge variant={trade.status === 'active' ? 'default' : 'secondary'}>
                          {trade.status === 'active' ? 'Активен' : 
                           trade.status === 'completed' ? 'Завершен' : 'Отменен'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">Предлагаю:</div>
                          <div className="text-sm">{trade.card_name}</div>
                          <Badge className={`text-xs text-white mt-1 ${rarityColors[trade.card_rarity as keyof typeof rarityColors] || 'bg-gray-500'}`}>
                            {trade.card_rarity}
                          </Badge>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-1">Хочу:</div>
                          <div className="text-sm">{trade.wanted_card}</div>
                          <Badge className={`text-xs text-white mt-1 ${rarityColors[trade.wanted_rarity as keyof typeof rarityColors] || 'bg-gray-500'}`}>
                            {trade.wanted_rarity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Создание обмена */}
          {activeTab === 'create' && (
            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle>Создать предложение обмена</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Предлагаемая карта:</label>
                  <select 
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="">Выберите карту</option>
                    {userCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} ({card.rarity}) x{card.count}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Желаемая карта:</label>
                  <Input
                    value={wantedCard}
                    onChange={(e) => setWantedCard(e.target.value)}
                    placeholder="Название карты"
                    className="mb-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Редкость желаемой карты:</label>
                  <select 
                    value={wantedRarity}
                    onChange={(e) => setWantedRarity(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="">Выберите редкость</option>
                    <option value="classic">Классическая</option>
                    <option value="rare">Редкая</option>
                    <option value="epic">Эпическая</option>
                    <option value="legendary">Легендарная</option>
                    <option value="stock">Акция</option>
                  </select>
                </div>

                <Button
                  onClick={createTradeOffer}
                  disabled={!selectedCard || !wantedCard || !wantedRarity}
                  className="w-full bg-[var(--tg-theme-button-color,#5bc8fb)] text-[var(--tg-theme-button-text-color,#fff)]"
                >
                  Создать предложение
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* <GameMenu /> */}
      </div>
    </div>
  );
}
