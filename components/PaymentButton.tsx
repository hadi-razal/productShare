import React, { useState } from 'react';
import { Check, X, Zap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

// Custom Dialog Component
interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative z-50 w-full max-w-3xl mx-4">
                {children}
            </div>
        </div>
    );
};

// Custom Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'default', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        default: 'bg-blue-950 text-white',
        outline: 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-900',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

// Custom Switch Component
interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-gray-400 transition-transform translate-x-0.5 shadow-lg ${checked ? 'translate-x-5' : ''}`}
            />
        </button>
    );
};

// Custom Badge Component
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'secondary';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-900',
        secondary: 'bg-green-100 text-green-700',
    };

    return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${variants[variant]}`}>{children}</span>;
};


interface PricingButtonProps {
    userId: string;
}

const PricingButton: React.FC<PricingButtonProps> = ({ userId }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isYearly, setIsYearly] = useState(false);

    const plan = {
        name: 'Pro Plan',
        monthlyPrice: 9900,
        yearlyPrice: 99999,
        features: [
            'Up to 100 products',
            'Advanced analytics & reporting',
            'Videos can be added to the product display',
            'Priority support',
            'Unlimited product images per item',
            'Shareable catalog link for easy distribution',
            'User-friendly product search and filtering',
            'Integration with social media sharing',
            'Add-to-cart or wishlist options for users',
            'Customer feedback and review section',
            'SEO-friendly URLs for better online visibility',
            'Password-protected catalog for privacy',
            'Display sale and discount tags on products'
        ]

    };

    const handlePayment = async () => {
        const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

        const options = {
            key: 'rzp_test_rCILEJykWqLnh9',
            amount,
            currency: 'INR',
            name: 'CatalogPro Builder',
            description: `${plan.name} - ${isYearly ? 'Annual' : 'Monthly'} Subscription`,
            image: '/logo.png',
            handler: async (response: { razorpay_payment_id: string }) => {
                const userDocRef = doc(db, 'users', userId);
                try {
                    await updateDoc(userDocRef, {
                        latestPaymentId: response.razorpay_payment_id,
                        PaymentIdHistory: arrayUnion(response.razorpay_payment_id),
                        LastPayedOn: serverTimestamp(),
                        isPremiumUser: true,
                        billingCycle: isYearly ? 'yearly' : 'monthly',
                        PremiumExpireDate: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000),
                    });
                    setIsOpen(false);
                } catch (error) {
                    console.error('Error updating Firestore: ', error);
                }
            },
            theme: { color: '#4F46E5' },
            modal: { confirm_close: true },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <div className="bg-white rounded-xl shadow-2xl">
                    <div className="relative p-6">
                        {/* Close Button */}
                        <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                            <X className="h-4 w-4" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Choose Your Growth Plan</h2>
                        </div>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className={`text-sm ${!isYearly ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                                Monthly
                            </span>
                            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${isYearly ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                                    Yearly
                                </span>
                                <Badge variant="secondary">Save 20%</Badge>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-xl border-2 border-indigo-500 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">{plan.name}</h3>
                                <div className="text-2xl font-bold text-indigo-600">
                                    ₹{((isYearly ? plan.yearlyPrice : plan.monthlyPrice) / 100).toFixed(2)}
                                    <span className="text-base text-gray-500 ml-1">/{isYearly ? 'year' : 'month'}</span>
                                </div>
                            </div>

                            <ul className="grid gap-3 sm:grid-cols-2 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Button variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handlePayment}>Proceed to Payment</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default PricingButton;
