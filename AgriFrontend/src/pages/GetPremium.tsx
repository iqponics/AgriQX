import { useState, useEffect } from 'react';
import { CheckCircle2, Zap, BadgeCheck, ChevronLeft, CreditCard, Star, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '../components/ToastProvider';

const PremiumPage = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const handleSubscription = async (planType: 'monthly' | 'yearly') => {
    if (!userId) {
      error("Please login to subscribe");
      return;
    }
    setLoadingPlan(planType);

    try {
      const amount = planType === 'monthly' ? 299 : 2999;

      // In a real scenario, we'd fetch order from backend
      console.log(`Creating order for amount: ${amount} INR for user: ${userId}`);
      // const orderData = await fetchData<any, any>('/payment/create-order', 'POST', {
      //   body: { amount, currency: 'INR', planType, userId }
      // });

      // Mocking the payment success for now since Razorpay requires key
      setTimeout(() => {
        success(`${planType.toUpperCase()} Subscription activated successfully! Welcome to the premium flock.`);
        setLoadingPlan(null);
        navigate('/profile');
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      error('Payment failed. Please try again.');
    } finally {
      // setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream-200 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16 px-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-28 left-8 p-3 bg-white hover:bg-leaf-50 text-leaf-600 rounded-2xl shadow-lg border border-leaf-100 transition-all active:scale-95 hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center gap-2 bg-leaf-600 text-white px-6 py-2 rounded-full mb-6 shadow-xl shadow-leaf-100 font-bold uppercase tracking-widest text-xs">
            <Zap className="w-4 h-4" />
            Empower Your Farm with Premium
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-leaf-800 font-poppins mb-6">
            Ponics Pro Plans
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Unlock expert agricultural insights, unlimited soil reports, and direct access to top agronomists.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Basic Plan */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-leaf-100/10 border border-leaf-100/50 flex flex-col">
            <div className="mb-8">
              <div className="p-3 bg-leaf-50 w-fit rounded-2xl mb-4">
                <ShieldCheck className="w-8 h-8 text-leaf-600" />
              </div>
              <h3 className="text-2xl font-black text-charcoal-900 mb-2 font-poppins">Soil Starter</h3>
              <div className="my-6">
                <span className="text-5xl font-black text-leaf-800">Free</span>
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase mb-8">Best for hobbyist gardeners</p>
              <button
                className="w-full bg-leaf-50 text-leaf-400 py-4 rounded-2xl font-black border-2 border-leaf-100 cursor-default opacity-50"
                disabled
              >
                Current Harvest
              </button>
            </div>
            <div className="space-y-4 mt-auto">
              <FeatureItem text="2 Expert Calls / month" />
              <FeatureItem text="Community Forum Access" />
              <FeatureItem text="Basic Weather Alerts" />
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-leaf-200/30 border-4 border-leaf-600 flex flex-col relative scale-105 z-10">
            <div className="absolute top-6 right-6">
              <span className="bg-amber-400 text-charcoal-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Popular</span>
            </div>
            <div className="mb-8">
              <div className="p-3 bg-leaf-600 w-fit rounded-2xl mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-charcoal-900 mb-2 font-poppins">Harvest Hero</h3>
              <div className="my-6">
                <span className="text-5xl font-black text-leaf-800">₹299</span>
                <span className="text-gray-400 font-bold ml-2">/ month</span>
              </div>
              <p className="text-leaf-600 font-black text-sm uppercase mb-8">Ideal for productive small farms</p>
              <button
                onClick={() => handleSubscription('monthly')}
                className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-leaf-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                disabled={loadingPlan === 'monthly'}
              >
                {loadingPlan === 'monthly' ? 'Sowing...' : 'Plant Now'}
              </button>
            </div>
            <div className="space-y-4 mt-auto">
              <FeatureItem text="15 Expert Calls / month" checked />
              <FeatureItem text="Unlimited Soil Reports" checked />
              <FeatureItem text="Priority Forum Access" checked />
              <FeatureItem text="Market Price Predictions" checked />
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="bg-leaf-800 p-8 rounded-[2.5rem] shadow-xl shadow-leaf-100/20 border border-leaf-700 flex flex-col text-white">
            <div className="mb-8">
              <div className="p-3 bg-white/10 backdrop-blur-md w-fit rounded-2xl mb-4">
                <Star className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 font-poppins">Estate Elite</h3>
              <div className="my-6">
                <span className="text-5xl font-black text-white">₹2,999</span>
                <span className="text-leaf-300 font-bold ml-2">/ year</span>
              </div>
              <p className="text-amber-400 font-black text-sm uppercase mb-8 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> Save over 15%
              </p>
              <button
                onClick={() => handleSubscription('yearly')}
                className="w-full bg-white text-leaf-800 hover:bg-leaf-50 py-4 rounded-2xl font-black shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                disabled={loadingPlan === 'yearly'}
              >
                {loadingPlan === 'yearly' ? 'Preparing Field...' : 'Secure Full Access'}
              </button>
            </div>
            <div className="space-y-4 mt-auto">
              <FeatureItem text="Unlimited Expert Advice" checked white />
              <FeatureItem text="Personal Farm Consultant" checked white />
              <FeatureItem text="Satellite Crop Monitoring" checked white />
              <FeatureItem text="0% Interest Tool Loans" checked white />
            </div>
          </div>
        </div>

        <div className="mt-20 bg-white p-10 rounded-[3rem] shadow-xl shadow-leaf-100/10 border border-leaf-100/50 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-leaf-50 p-6 rounded-[2rem]">
            <CreditCard className="w-12 h-12 text-leaf-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-black text-leaf-800 font-poppins mb-2 text-center md:text-left">Secure Payment Guarantee</h4>
            <p className="text-gray-500 font-medium">All transactions are encrypted and secured by Razorpay. We never store your credit card details.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-leaf-50 rounded-2xl border border-leaf-100 text-leaf-600 font-black text-xs uppercase tracking-widest">VISA</div>
            <div className="px-6 py-3 bg-leaf-50 rounded-2xl border border-leaf-100 text-leaf-600 font-black text-xs uppercase tracking-widest">MasterCard</div>
            <div className="px-6 py-3 bg-leaf-50 rounded-2xl border border-leaf-100 text-leaf-600 font-black text-xs uppercase tracking-widest">UPI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text, checked = true, white = false }: {
  text: string;
  checked?: boolean;
  white?: boolean;
}) => (
  <div className="flex items-center gap-3">
    {checked ? (
      <CheckCircle2 className={`w-5 h-5 shrink-0 ${white ? 'text-amber-400' : 'text-leaf-400'}`} />
    ) : (
      <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
    )}
    <span className={`font-bold ${white ? 'text-leaf-50' : 'text-charcoal-700'}`}>{text}</span>
  </div>
);

export default PremiumPage;
