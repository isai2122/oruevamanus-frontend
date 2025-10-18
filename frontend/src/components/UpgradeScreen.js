import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  X,
  Crown,
  Zap,
  TrendingUp,
  Shield,
  Rocket,
  Phone,
  Mail,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UpgradeScreen = () => {
  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    fetchUserPlan();
    fetchPaymentInfo();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API}/plans`);
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const response = await axios.get(`${API}/user/plan`);
      setUserPlan(response.data);
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      const response = await axios.get(`${API}/payment/instructions`);
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('Error fetching payment info:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Crown className="w-10 h-10 text-yellow-500" />
          Actualiza a Premium
        </h1>
        <p className="text-xl text-slate-600">
          Desbloquea todo el potencial del Asistente-Definitivo con funcionalidades SUPER ilimitadas
        </p>
      </div>

      {/* Current Plan Badge */}
      {userPlan && (
        <div className="text-center">
          <Badge className={`text-lg px-6 py-2 ${userPlan.current_plan === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-slate-600'}`}>
            Plan Actual: {userPlan.current_plan === 'premium' ? 'Premium' : 'Gratuito'}
          </Badge>
        </div>
      )}

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`modern-card hover-lift relative overflow-hidden ${
              plan.id === 'premium' 
                ? 'border-2 border-yellow-500 shadow-2xl' 
                : ''
            }`}
          >
            {plan.id === 'premium' && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                MÁS POPULAR
              </div>
            )}
            
            <CardHeader className={plan.id === 'premium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}>
              <CardTitle className="flex items-center gap-2 text-2xl">
                {plan.id === 'premium' ? (
                  <Crown className="w-6 h-6 text-yellow-600" />
                ) : (
                  <Sparkles className="w-6 h-6 text-slate-600" />
                )}
                {plan.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Price */}
              <div className="text-center py-4">
                {plan.price === 0 ? (
                  <div>
                    <p className="text-5xl font-bold text-slate-900">$0</p>
                    <p className="text-slate-600 mt-2">Gratis para siempre</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline justify-center gap-2">
                      <p className="text-5xl font-bold text-slate-900">
                        ${plan.price_cop?.toLocaleString()}
                      </p>
                      <span className="text-slate-600">COP/mes</span>
                    </div>
                    <p className="text-slate-600 mt-2">o ${plan.price_usd} USD/mes</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {feature.startsWith('✅') ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.startsWith('✅') ? 'text-slate-900' : 'text-slate-500'}`}>
                      {feature.replace('✅ ', '').replace('❌ ', '')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {plan.id === 'free' ? (
                  <Button 
                    disabled 
                    variant="outline" 
                    className="w-full"
                  >
                    {userPlan?.current_plan === 'free' ? 'Plan Actual' : 'Plan Básico'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleUpgrade}
                    disabled={userPlan?.current_plan === 'premium'}
                    className="w-full btn-modern bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold text-lg py-6"
                  >
                    {userPlan?.current_plan === 'premium' ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Ya eres Premium
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Actualizar Ahora
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Stats for Free Users */}
      {userPlan && userPlan.current_plan === 'free' && (
        <Card className="modern-card max-w-2xl mx-auto bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <TrendingUp className="w-5 h-5" />
              Tu Uso Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-800">Proyectos</span>
              <span className="font-semibold text-orange-900">
                {userPlan.usage.projects} / {userPlan.limits.max_projects}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-800">Análisis IA hoy</span>
              <span className="font-semibold text-orange-900">
                {userPlan.usage.ai_analysis_today} / {userPlan.limits.max_ai_analysis_per_day}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-800">Subidas al chat hoy</span>
              <span className="font-semibold text-orange-900">
                {userPlan.usage.chat_uploads_today} / {userPlan.limits.max_chat_uploads_per_day}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Phone className="w-6 h-6 text-indigo-600" />
              Instrucciones de Pago - Nequi
            </DialogTitle>
          </DialogHeader>

          {paymentInfo && (
            <div className="space-y-6 py-4">
              {/* Price */}
              <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Precio Mensual</p>
                <p className="text-4xl font-bold text-slate-900">
                  ${paymentInfo.price_cop.toLocaleString()} COP
                </p>
                <p className="text-slate-600 mt-1">o ${paymentInfo.price_usd} USD</p>
              </div>

              {/* Nequi Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600">Número Nequi</p>
                    <p className="text-lg font-semibold text-slate-900">{paymentInfo.phone}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentInfo.phone)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600">Nombre</p>
                  <p className="text-lg font-semibold text-slate-900">{paymentInfo.name}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 mb-3">Pasos para pagar:</p>
                {paymentInfo.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-semibold text-indigo-600">{instruction.split('.')[0]}.</span>
                    <span>{instruction.substring(instruction.indexOf('.') + 1)}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Envía tu comprobante a: <strong>ortizisacc18@gmail.com</strong></span>
                </p>
              </div>

              {/* Note */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <Shield className="w-4 h-4 inline mr-1" />
                  {paymentInfo.note}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpgradeScreen;
