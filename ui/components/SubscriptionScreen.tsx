import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Check, Sparkles } from './Icons';
import BrandLogo from './BrandLogo';
import { useAuth } from '../hooks/useAuth';
import { getSubscription, subscribe } from '../lib/wellnessApi';

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  caption: string;
  badge?: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    caption: 'Billed monthly. Cancel anytime.',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$59.99',
    period: '/year',
    caption: 'Just $5/mo — billed annually.',
    badge: 'Save 50%',
    highlight: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$149.99',
    period: 'once',
    caption: 'Pay once. Yours forever.',
  },
];

const FEATURES: string[] = [
  'Unlimited AI Companion conversations',
  'Full library of guided pranayama & meditations',
  'Personalized daily recommendations',
  'Premium sleep stories & soundscapes',
  'Advanced progress tracking & insights',
  'Offline downloads',
  'Ad-free experience',
];

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [selected, setSelected] = useState<string>('yearly');
  const [currentPlan, setCurrentPlan] = useState<string>('FREE'); // active plan from backend
  const [busy, setBusy] = useState(false);

  const selectedPlan = PLANS.find(p => p.id === selected) ?? PLANS[1];

  // Load the user's current plan and preselect it if they're already premium.
  useEffect(() => {
    getSubscription(token)
      .then(sub => {
        setCurrentPlan(sub.plan);
        if (sub.premium && sub.plan) setSelected(sub.plan.toLowerCase());
      })
      .catch(() => {});
  }, [token]);

  const handleSubscribe = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // NOTE: real billing/IAP goes here; on success we persist the plan.
      const sub = await subscribe(token, selected);
      setCurrentPlan(sub.plan);
    } catch {
      // keep the screen usable if the call fails
    } finally {
      setBusy(false);
    }
  };

  const isCurrent = (planId: string) => currentPlan.toLowerCase() === planId.toLowerCase();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BrandLogo size={72} style={{ marginBottom: 16 }} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Karmana Premium
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Unlock your full wellness journey with everything Karmana has to
            offer.
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plans}>
          {PLANS.map(plan => {
            const isSelected = plan.id === selected;
            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.85}
                onPress={() => setSelected(plan.id)}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                  isSelected && styles.planCardSelected,
                ]}
              >
                <View style={styles.planLeft}>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isSelected
                          ? colors.accent
                          : colors.borderStrong,
                        backgroundColor: isSelected
                          ? colors.accent
                          : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <Check size={12} color="#fff" />}
                  </View>
                  <View>
                    <View style={styles.planNameRow}>
                      <Text
                        style={[styles.planName, { color: colors.textPrimary }]}
                      >
                        {plan.name}
                      </Text>
                      {plan.badge && (
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: colors.statMintSoft },
                          ]}
                        >
                          <Text
                            style={[styles.badgeText, { color: colors.statMint }]}
                          >
                            {plan.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[styles.planCaption, { color: colors.textSecondary }]}
                    >
                      {plan.caption}
                    </Text>
                  </View>
                </View>
                <View style={styles.planPriceWrap}>
                  <Text style={[styles.planPrice, { color: colors.textPrimary }]}>
                    {plan.price}
                  </Text>
                  <Text
                    style={[styles.planPeriod, { color: colors.textSecondary }]}
                  >
                    {plan.period}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Features */}
        <View
          style={[
            styles.featuresCard,
            { backgroundColor: colors.cardLight, borderColor: colors.border },
          ]}
        >
          <View style={styles.featuresHeader}>
            <Sparkles size={18} color={colors.accent} />
            <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
              What's included
            </Text>
          </View>
          {FEATURES.map(feature => (
            <View key={feature} style={styles.featureRow}>
              <View
                style={[styles.checkWrap, { backgroundColor: colors.accentSoft }]}
              >
                <Check size={12} color={colors.accent} />
              </View>
              <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.terms, { color: colors.textSecondary }]}>
          Subscriptions renew automatically unless cancelled at least 24 hours
          before the end of the current period. Manage or cancel anytime in your
          account settings. By continuing you agree to our Terms of Service and
          Privacy Policy.
        </Text>
      </ScrollView>

      {/* CTA */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cta, { backgroundColor: colors.accent }, busy && { opacity: 0.6 }]}
          onPress={handleSubscribe}
          disabled={busy || isCurrent(selected)}
        >
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaText}>
              {isCurrent(selected)
                ? `${selectedPlan.name} — active`
                : `Start ${selectedPlan.name} — ${selectedPlan.price}${selectedPlan.period === 'once' ? '' : selectedPlan.period}`}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={[styles.restore, { color: colors.textSecondary }]}>
          Restore purchases
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 24 },
  header: { alignItems: 'center', marginTop: 8, marginBottom: 24 },
  crownWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  plans: { gap: 12, marginBottom: 24 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  planCardSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planName: { fontSize: 16, fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  planCaption: { fontSize: 12, marginTop: 2 },
  planPriceWrap: { alignItems: 'flex-end' },
  planPrice: { fontSize: 18, fontWeight: '700' },
  planPeriod: { fontSize: 12 },
  featuresCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  featuresTitle: { fontSize: 16, fontWeight: '700' },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { fontSize: 14, flex: 1 },
  terms: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
  footer: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  cta: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  restore: { fontSize: 13, textAlign: 'center', marginTop: 12 },
});
