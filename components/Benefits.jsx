import React from 'react';
import './Benefits.css';

const benefits = [
  {
    id: 1,
    title: 'Builds Confidence',
    icon: '💪',
    description: 'Interactive challenges help children develop self-assurance and decision-making skills'
  },
  {
    id: 2,
    title: 'Teaches Real-Life Skills',
    icon: '🎯',
    description: 'Practical scenarios prepare kids for everyday situations and emergencies'
  },
  {
    id: 3,
    title: 'Rewards Good Decisions',
    icon: '🏆',
    description: 'Positive reinforcement through points and achievements encourages good behavior'
  },
  {
    id: 4,
    title: 'Encourages Kindness & Teamwork',
    icon: '🤝',
    description: 'Collaborative games promote empathy and social skills development'
  }
];

const Benefits = () => {
  return (
    <section className="benefits">
      <h2 className="section-title">Why Play With Us?</h2>
      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits; 