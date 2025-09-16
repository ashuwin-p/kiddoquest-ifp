"use client";
import React, { useState, useMemo } from "react";

const scenarios = [
  {
    question: "You find a lost wallet in your school. What do you do?",
    options: [
      {
        text: "Return it to the teacher or lost & found.",
        value: 2,
        feedback: "Great! This shows honesty and responsibility.",
  sound: "/sounds/correct.wav"
      },
      {
        text: "Keep it for yourself.",
        value: -2,
        feedback: "This is not honest. Try to do the right thing next time.",
  sound: "/sounds/incorrect.wav"
      },
      {
        text: "Ask your friends what to do.",
        value: 1,
        feedback: "Seeking advice is good, but honesty is best!",
  sound: "/sounds/correct.wav"
      }
    ]
  },
  {
    question: "A new student looks lonely during lunch. What will you do?",
    options: [
      {
        text: "Invite them to join you.",
        value: 2,
        feedback: "Kindness and inclusion help build character!",
  sound: "/sounds/correct.wav"
      },
      {
        text: "Ignore them and stay with your group.",
        value: -1,
        feedback: "Try to be more inclusive next time.",
  sound: "/sounds/incorrect.wav"
      },
      {
        text: "Smile at them from afar.",
        value: 1,
        feedback: "A smile is nice, but inviting is even better!",
  sound: "/sounds/correct.wav"
      }
    ]
  },
  {
    question: "You see someone being bullied. What do you do?",
    options: [
      {
        text: "Stand up for them or get help.",
        value: 2,
        feedback: "Standing up for others shows courage and empathy!",
  sound: "/sounds/correct.wav"
      },
      {
        text: "Join in with the bullies.",
        value: -2,
        feedback: "Bullying is wrong. Always choose kindness.",
  sound: "/sounds/incorrect.wav"
      },
      {
        text: "Ignore and walk away.",
        value: 0,
        feedback: "It's better to help or get an adult involved.",
  sound: "/sounds/correct.wav"
      }
    ]
  },
  {
    question: "Your team lost a match. What do you do?",
    options: [
      {
        text: "Congratulate the winners and try harder next time.",
        value: 2,
        feedback: "Good sportsmanship and perseverance!",
        sound: "/sounds/correct.wav"
      },
      {
        text: "Blame your teammates.",
        value: -2,
        feedback: "Blaming others is not teamwork. Support each other!",
        sound: "/sounds/incorrect.wav"
      },
      {
        text: "Feel sad and give up.",
        value: -1,
        feedback: "Don't give up! Learn and grow from every experience.",
        sound: "/sounds/incorrect.wav"
      }
    ]
  },
  {
    question: "You see litter in the park. What do you do?",
    options: [
      {
        text: "Pick it up and throw it in the bin.",
        value: 2,
        feedback: "Great! You care for the environment.",
        sound: "/sounds/correct.wav"
      },
      {
        text: "Ignore it, it's not your problem.",
        value: -1,
        feedback: "We all share responsibility for our planet.",
        sound: "/sounds/incorrect.wav"
      },
      {
        text: "Tell an adult or park staff.",
        value: 1,
        feedback: "Good! Getting help is also responsible.",
        sound: "/sounds/correct.wav"
      }
    ]
  },
  {
    question: "There's a fire drill at school. What do you do?",
    options: [
      {
        text: "Stay calm and follow instructions.",
        value: 2,
        feedback: "Excellent! Safety and calmness are important.",
        sound: "/sounds/correct.wav"
      },
      {
        text: "Panic and run around.",
        value: -2,
        feedback: "Panic can be dangerous. Always stay calm.",
        sound: "/sounds/incorrect.wav"
      },
      {
        text: "Ignore the drill and keep playing.",
        value: -1,
        feedback: "Safety drills are important. Pay attention!",
        sound: "/sounds/incorrect.wav"
      }
    ]
  }
];


export default function LifeSkillsQuestGame() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [playingSound, setPlayingSound] = useState(false);

  function handleOption(option) {
    setScore(score + option.value);
    setFeedback(option.feedback);
    setPlayingSound(true);
    const audio = new window.Audio(option.sound);
    audio.play();
    audio.onended = () => setPlayingSound(false);
    setTimeout(() => {
      setFeedback("");
      if (step < scenarios.length - 1) {
        setStep(step + 1);
      } else {
        setFinished(true);
      }
    }, 5000); // Increased feedback time
  }

  // Shuffle choices for each question
  const shuffledOptions = useMemo(() => {
    const opts = scenarios[step].options.slice();
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-50 via-accent-50 to-success-50 font-display p-4">
      <div className="bg-white/80 rounded-3xl shadow-playful p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-primary-600 mb-4">Life Skills Quest: Character Development</h2>
        <div className="mb-2 text-right text-sm text-gray-500">Question {step + 1} of {scenarios.length}</div>
        <div className="mb-2 text-right text-sm text-success-600">Score: {score}</div>
        {!finished ? (
          <>
            <p className="text-lg mb-6">{scenarios[step].question}</p>
            <div className="space-y-4">
              {shuffledOptions.map((option, idx) => (
                <button
                  key={idx}
                  className={`w-full px-4 py-2 rounded-xl font-semibold transition text-white border-4 bg-primary-500 hover:bg-primary-600 border-primary-200
                    ${!!feedback || playingSound ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                  onClick={() => handleOption(option)}
                  disabled={!!feedback || playingSound}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="mt-6 p-4 rounded-xl bg-accent-50 text-accent-700 font-semibold text-center shadow animate-bounce">
                {feedback}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold text-success-600 mb-2">Level Complete!</h3>
            <p className="mb-4">Your character score: <span className="font-bold">{score}</span></p>
            <p className="mb-2">Thank you for making good choices!</p>
            <button className="px-4 py-2 rounded-xl bg-success-500 hover:bg-success-600 text-white font-semibold" onClick={() => { setStep(0); setScore(0); setFinished(false); }}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
