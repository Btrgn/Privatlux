import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Shield, Heart, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <HomeWrapper>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroTitle>
              Welcome to <span className="brand">PrivatLux</span>
            </HeroTitle>
            <HeroSubtitle>
              The UK's Most Exclusive Adult Entertainment Platform
            </HeroSubtitle>
            <HeroDescription>
              Discover premium companionship with complete discretion and unparalleled elegance. 
              Our carefully curated selection ensures the finest experiences.
            </HeroDescription>
            <HeroActions>
              <PrimaryButton as={Link} to="/register">
                <Crown size={20} />
                Join PrivatLux
              </PrimaryButton>
              <SecondaryButton as={Link} to="/escorts">
                Browse Companions
              </SecondaryButton>
            </HeroActions>
          </motion.div>
        </HeroContent>
        <HeroBackground />
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <div className="container">
          <SectionTitle>Why Choose PrivatLux?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <Shield size={32} />
              </FeatureIcon>
              <FeatureTitle>Complete Privacy</FeatureTitle>
              <FeatureDescription>
                GDPR compliant with absolute discretion. Your privacy and security are our top priority.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <Star size={32} />
              </FeatureIcon>
              <FeatureTitle>Verified Companions</FeatureTitle>
              <FeatureDescription>
                All companions are personally verified and professionally vetted for authenticity and quality.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <Heart size={32} />
              </FeatureIcon>
              <FeatureTitle>Premium Experience</FeatureTitle>
              <FeatureDescription>
                Exclusive access to the finest companions across the UK with unmatched sophistication.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      {/* Membership Section */}
      <MembershipSection>
        <div className="container">
          <SectionTitle>Exclusive Membership Access</SectionTitle>
          <MembershipContent>
            <MembershipText>
              <h3>Unlock Premium Content</h3>
              <p>
                Join our exclusive membership to access unblurred photos, full contact details, 
                and premium companion profiles. Experience true luxury and discretion.
              </p>
              <MembershipFeatures>
                <li>Unlimited access to verified companions</li>
                <li>High-resolution photo galleries</li>
                <li>Direct contact information</li>
                <li>Advanced search and filtering</li>
                <li>Personalized recommendations</li>
                <li>Priority customer support</li>
              </MembershipFeatures>
              <PrimaryButton as={Link} to="/pricing">
                View Membership Plans
              </PrimaryButton>
            </MembershipText>
            <MembershipVisual>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Crown size={120} />
              </motion.div>
            </MembershipVisual>
          </MembershipContent>
        </div>
      </MembershipSection>

      {/* CTA Section */}
      <CTASection>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <CTATitle>Ready to Experience Luxury?</CTATitle>
            <CTADescription>
              Join thousands of discerning individuals who trust PrivatLux for their entertainment needs.
            </CTADescription>
            <CTAActions>
              <PrimaryButton as={Link} to="/register?role=member">
                Become a Member
              </PrimaryButton>
              <SecondaryButton as={Link} to="/register?role=escort">
                Join as Companion
              </SecondaryButton>
            </CTAActions>
          </motion.div>
        </div>
      </CTASection>
    </HomeWrapper>
  );
};

// Styled Components
const HomeWrapper = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.background.primary} 0%,
    ${props => props.theme.colors.background.secondary} 50%,
    ${props => props.theme.colors.background.primary} 100%
  );
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, 
      ${props => props.theme.colors.primary.main}10 0%,
      transparent 50%
    ), radial-gradient(circle at 70% 70%, 
      ${props => props.theme.colors.secondary.main}10 0%,
      transparent 50%
    );
  }
`;

const HeroContent = styled.div`
  text-align: center;
  z-index: 1;
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['5xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  .brand {
    background: ${props => props.theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

const HeroSubtitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  font-weight: ${props => props.theme.fontWeights.normal};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
`;

const HeroDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  line-height: 1.6;
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary.gradient};
  color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.base};
  text-decoration: none;
  transition: ${props => props.theme.transitions.base};
  box-shadow: ${props => props.theme.shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: transparent;
  color: ${props => props.theme.colors.primary.main};
  border: 2px solid ${props => props.theme.colors.primary.main};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.base};
  text-decoration: none;
  transition: ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.primary.main};
    color: ${props => props.theme.colors.background.primary};
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: ${props => props.theme.colors.background.secondary};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.text.primary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.colors.background.card};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.xl};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border.primary};
  transition: ${props => props.theme.transitions.base};

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: ${props => props.theme.shadows.gold};
  }
`;

const FeatureIcon = styled.div`
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
`;

const MembershipSection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: ${props => props.theme.colors.background.primary};
`;

const MembershipContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing['2xl']};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const MembershipText = styled.div`
  h3 {
    color: ${props => props.theme.colors.primary.main};
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`;

const MembershipFeatures = styled.ul`
  list-style: none;
  margin-bottom: ${props => props.theme.spacing.xl};

  li {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: ${props => props.theme.spacing.sm};
    position: relative;
    padding-left: ${props => props.theme.spacing.lg};

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary.main};
      font-weight: bold;
    }
  }
`;

const MembershipVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.primary.main};
  opacity: 0.3;
`;

const CTASection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: ${props => props.theme.colors.background.secondary};
  text-align: center;
`;

const CTATitle = styled.h2`
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.primary};
`;

const CTADescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const CTAActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

export default HomePage;