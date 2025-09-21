"use client";

import { useState, useEffect, useRef } from "react";

export default function CommunityHelpersGame() {
	const [state, setState] = useState({
		role: null,
		score: 0,
		high: typeof window !== 'undefined' ? Number(localStorage.getItem('ch_high') || 0) : 0,
		timer: null,
		time: 0,
		task: null,
		roleIndex: 0,
		roles: ['fire', 'doctor', 'teacher'],
		taskCompleted: false,
	});

	const timerRef = useRef(null);
	const playAreaRef = useRef(null);

	// Auto-assign roles instead of manual selection
	const assignNextRole = () => {
		const newRole = state.roles[state.roleIndex];
		const newRoleIndex = (state.roleIndex + 1) % state.roles.length;
		
		setState(prev => ({
			...prev,
			role: newRole,
			roleIndex: newRoleIndex,
			taskCompleted: false
		}));
		
		startTaskForRole(newRole);
	};

	// Utilities
	const setScore = (delta) => {
		setState(prev => {
			const newScore = Math.max(0, prev.score + delta);
			const newHigh = newScore > prev.high ? newScore : prev.high;
			
			if (typeof window !== 'undefined' && newScore > prev.high) {
				localStorage.setItem('ch_high', newHigh);
			}
			
			return {
				...prev,
				score: newScore,
				high: newHigh
			};
		});
	};

	const clearPlay = () => {
		if (playAreaRef.current) {
			playAreaRef.current.innerHTML = '';
		}
	};

	// Timer
	const startTimer = (seconds, onExpire) => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		
		setState(prev => ({ ...prev, time: seconds }));
		
		timerRef.current = setInterval(() => {
			setState(prev => {
				const newTime = prev.time - 0.1;
				if (newTime <= 0) {
					clearInterval(timerRef.current);
					onExpire && onExpire();
					return { ...prev, time: 0 };
				}
				return { ...prev, time: newTime };
			});
		}, 100);
	};

	const updateTimerUI = () => {
		const pct = Math.max(0, (state.time / 10) * 100);
		const timerBar = document.getElementById('timer-bar');
		const timeLeftEl = document.getElementById('time-left');
		
		if (timerBar) timerBar.style.width = pct + '%';
		if (timeLeftEl) timeLeftEl.textContent = Math.ceil(state.time) + 's';
	};

	useEffect(() => {
		updateTimerUI();
	}, [state.time]);

	const nextTask = () => {
		assignNextRole();
	};

	const resetScore = () => {
		setState(prev => ({
			...prev,
			score: 0,
			high: 0
		}));
		if (typeof window !== 'undefined') {
			localStorage.removeItem('ch_high');
		}
	};

	// Task generators for each role
	const startTaskForRole = (role) => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		clearPlay();
		
		if (role === 'fire') startFirefighterTask();
		if (role === 'doctor') startDoctorTask();
		if (role === 'teacher') startTeacherTask();
	};

	// Firefighter Task
	const startFirefighterTask = () => {
		const tasks = [
			{
				type: 'fire',
				title: 'Fire Suppression',
				desc: 'Put out the fire and rescue objects. Click water to douse flames.',
				icon: '🔥',
				color: '#ff4444'
			},
			{
				type: 'rescue',
				title: 'Rescue Mission',
				desc: 'Save people trapped in the building. Choose the right rescue equipment.',
				icon: '🚑',
				color: '#44aa44'
			},
			{
				type: 'hazmat',
				title: 'Hazardous Materials',
				desc: 'Handle dangerous chemicals safely. Choose the correct protective gear.',
				icon: '☢️',
				color: '#ffaa00'
			},
			{
				type: 'ladder',
				title: 'Ladder Rescue',
				desc: 'Rescue people from upper floors. Position the ladder correctly.',
				icon: '🪜',
				color: '#4444ff'
			}
		];
		
		const task = tasks[Math.floor(Math.random() * tasks.length)];
		
		if (playAreaRef.current) {
			if (task.type === 'fire') {
				playAreaRef.current.innerHTML = `
					<div class="fire-task">
						<div class="task-header" style="background: ${task.color}; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
							<div style="font-size: 24px; margin-bottom: 4px;">${task.icon}</div>
							<div style="font-weight: bold; font-size: 16px;">${task.title}</div>
						</div>
						<div class="fire-row">
							<div style="flex:1">
								<div style="font-size:14px;color:#666; margin-bottom: 8px;">🏠 Burning Building</div>
								<div style="margin-top:8px; font-size: 20px;" id="fires">🔥🔥🔥</div>
								<div class="progress" style="margin-top:10px; background: #ffcccc;"><i id="fire-progress" style="width:100%; background: linear-gradient(90deg, #ff4444, #ff6666);"></i></div>
								<div style="margin-top: 6px; font-size: 12px; color: #666;">Fire Intensity</div>
							</div>
							<div style="width:160px;text-align:center; background: #f0f8ff; padding: 12px; border-radius: 8px; border: 2px solid #e0e8ff;">
								<div style="font-size:13px;color:#666; margin-bottom: 8px;">💧 Water Supply</div>
								<div class="center" style="margin-bottom: 8px;"><button class="btn" id="water-btn" style="background: #1e90ff;">💧 Throw Water (8 left)</button></div>
								<div style="margin-bottom: 4px;font-size:13px;color:#444;">Rescued: <span id="saved" style="font-weight: bold; color: #2db34a;">0</span></div>
								<div style="font-size:11px;color:#666;">Strategy: Use water wisely!</div>
							</div>
						</div>
					</div>
				`;
				startFireTask();
			} else if (task.type === 'rescue') {
				playAreaRef.current.innerHTML = `
					<div class="rescue-task">
						<div class="task-header" style="background: ${task.color}; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
							<div style="font-size: 24px; margin-bottom: 4px;">${task.icon}</div>
							<div style="font-weight: bold; font-size: 16px;">${task.title}</div>
						</div>
						<div style="text-align: center; margin-bottom: 16px;">
							<div style="font-size: 14px; color: #666; margin-bottom: 8px;">People trapped on 3rd floor - Choose rescue equipment:</div>
							<div class="choices" id="rescue-choices"></div>
						</div>
					</div>
				`;
				startRescueTask();
			} else if (task.type === 'hazmat') {
				playAreaRef.current.innerHTML = `
					<div class="hazmat-task">
						<div class="task-header" style="background: ${task.color}; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
							<div style="font-size: 24px; margin-bottom: 4px;">${task.icon}</div>
							<div style="font-weight: bold; font-size: 16px;">${task.title}</div>
						</div>
						<div style="text-align: center; margin-bottom: 16px;">
							<div style="font-size: 14px; color: #666; margin-bottom: 8px;">Chemical spill detected - Choose protective gear:</div>
							<div class="choices" id="hazmat-choices"></div>
						</div>
					</div>
				`;
				startHazmatTask();
			} else if (task.type === 'ladder') {
				playAreaRef.current.innerHTML = `
					<div class="ladder-task">
						<div class="task-header" style="background: ${task.color}; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
							<div style="font-size: 24px; margin-bottom: 4px;">${task.icon}</div>
							<div style="font-weight: bold; font-size: 16px;">${task.title}</div>
						</div>
						<div style="text-align: center; margin-bottom: 16px;">
							<div style="font-size: 14px; color: #666; margin-bottom: 8px;">Position the ladder to reach the 4th floor window:</div>
							<div class="choices" id="ladder-choices"></div>
						</div>
					</div>
				`;
				startLadderTask();
			}
		}
	};

	const startFireTask = () => {
		let fireLevel = 10; // 0 = out
		let saved = 0;
		let waterUsed = 0;
		const maxWater = 8;

		startTimer(12, () => {
			if (fireLevel > 0) setScore(-3);
			showEndMessage('Time up! Fire still burning. Move to next task.');
		});

		const handleWaterClick = () => {
			if (waterUsed >= maxWater) return;
			if (state.taskCompleted) return;
			
			waterUsed++;
			const waterBtn = document.getElementById('water-btn');
			if (waterBtn) {
				waterBtn.textContent = `💧 Water (${maxWater - waterUsed} left)`;
			}
			
			const reduce = Math.round(Math.random() * 3) + 1;
			fireLevel = Math.max(0, fireLevel - reduce);
			const pct = (fireLevel / 10) * 100;
			
			const fireProgress = document.getElementById('fire-progress');
			if (fireProgress) fireProgress.style.width = pct + '%';
			
			const flames = Math.ceil(fireLevel / 3);
			const fires = document.getElementById('fires');
			if (fires) fires.textContent = '🔥'.repeat(Math.max(0, flames));
			
			if (Math.random() > 0.6) {
				saved += 1;
				const savedEl = document.getElementById('saved');
				if (savedEl) savedEl.textContent = saved;
				setScore(5);
			}
			
			if (fireLevel === 0) {
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(15);
				showEndMessage('Excellent! Fire extinguished and ' + saved + ' people rescued! +15 pts');
			}
			
			if (waterUsed >= maxWater && fireLevel > 0) {
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(-5);
				showEndMessage('Out of water! Fire still burning. Better luck next time!');
			}
		};

		// Add event listener after a short delay to ensure DOM is ready
		setTimeout(() => {
			const waterBtn = document.getElementById('water-btn');
			if (waterBtn) {
				waterBtn.addEventListener('click', handleWaterClick);
			}
		}, 100);
	};

	const startRescueTask = () => {
		const scenarios = [
			{ q: 'Person trapped in smoke-filled room. Best rescue tool?', opts: ['Fire axe to break door', 'Water hose', 'Ladder truck'], ans: 0, hint: 'Need to break through barriers quickly.' },
			{ q: 'Person unconscious on 2nd floor. What to use?', opts: ['Aerial ladder', 'Fire blanket', 'Smoke detector'], ans: 0, hint: 'Need to reach high floors safely.' },
			{ q: 'Person stuck in elevator shaft. Rescue method?', opts: ['Rope and harness', 'Water rescue', 'Chemical extinguisher'], ans: 0, hint: 'Need specialized climbing equipment.' }
		];
		
		const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
		let answered = false;

		setTimeout(() => {
			const choicesDiv = document.getElementById('rescue-choices');
			if (choicesDiv) {
				scenario.opts.forEach((o, i) => {
					const d = document.createElement('div');
					d.className = 'choice';
					d.textContent = o;
					d.addEventListener('click', () => {
						if (answered) return;
						answered = true;
						setState(prev => ({ ...prev, taskCompleted: true }));
						
						if (i === scenario.ans) {
							d.classList.add('correct');
							setScore(12);
							showEndMessage('Perfect rescue technique! Person saved! +12 pts');
						} else {
							d.classList.add('wrong');
							setScore(-4);
							showEndMessage('Wrong equipment. Hint: ' + scenario.hint);
						}
					});
					choicesDiv.appendChild(d);
				});
			}
		}, 100);

		startTimer(15, () => {
			if (!answered) {
				answered = true;
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(-3);
				const choicesDiv = document.getElementById('rescue-choices');
				if (choicesDiv) {
					const correctChoice = choicesDiv.children[scenario.ans];
					if (correctChoice) correctChoice.classList.add('correct');
				}
				showEndMessage('Time over! Correct answer: ' + scenario.opts[scenario.ans] + '. Rescue failed!');
			}
		});
	};

	const startHazmatTask = () => {
		const scenarios = [
			{ q: 'Unknown chemical spill. What protective gear?', opts: ['Full hazmat suit', 'Regular uniform', 'Fire helmet only'], ans: 0, hint: 'Unknown chemicals require maximum protection.' },
			{ q: 'Gas leak detected. Safety approach?', opts: ['Turn off gas and ventilate', 'Light a match', 'Spray water'], ans: 0, hint: 'Gas leaks need ventilation, not ignition.' },
			{ q: 'Radioactive material found. Protection needed?', opts: ['Lead shielding suit', 'Firefighter gear', 'Raincoat'], ans: 0, hint: 'Radiation requires specialized shielding.' }
		];
		
		const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
		let answered = false;

		setTimeout(() => {
			const choicesDiv = document.getElementById('hazmat-choices');
			if (choicesDiv) {
				scenario.opts.forEach((o, i) => {
					const d = document.createElement('div');
					d.className = 'choice';
					d.textContent = o;
					d.addEventListener('click', () => {
						if (answered) return;
						answered = true;
						setState(prev => ({ ...prev, taskCompleted: true }));
						
						if (i === scenario.ans) {
							d.classList.add('correct');
							setScore(14);
							showEndMessage('Safe handling! Hazard contained! +14 pts');
						} else {
							d.classList.add('wrong');
							setScore(-6);
							showEndMessage('Dangerous choice! Hint: ' + scenario.hint);
						}
					});
					choicesDiv.appendChild(d);
				});
			}
		}, 100);

		startTimer(18, () => {
			if (!answered) {
				answered = true;
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(-4);
				const choicesDiv = document.getElementById('hazmat-choices');
				if (choicesDiv) {
					const correctChoice = choicesDiv.children[scenario.ans];
					if (correctChoice) correctChoice.classList.add('correct');
				}
				showEndMessage('Time over! Correct answer: ' + scenario.opts[scenario.ans] + '. Hazard exposure!');
			}
		});
	};

	const startLadderTask = () => {
		const scenarios = [
			{ q: 'Ladder needs to reach 4th floor (40ft). Best angle?', opts: ['75° angle', '45° angle', '90° straight up'], ans: 0, hint: '75° provides best stability and reach.' },
			{ q: 'Windy conditions. Ladder safety?', opts: ['Secure with ropes', 'Use as normal', 'Extend higher'], ans: 0, hint: 'Wind requires additional securing.' },
			{ q: 'Person on narrow ledge. Ladder placement?', opts: ['Directly below person', '5 feet to the side', '10 feet away'], ans: 0, hint: 'Direct placement allows easiest rescue.' }
		];
		
		const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
		let answered = false;

		setTimeout(() => {
			const choicesDiv = document.getElementById('ladder-choices');
			if (choicesDiv) {
				scenario.opts.forEach((o, i) => {
					const d = document.createElement('div');
					d.className = 'choice';
					d.textContent = o;
					d.addEventListener('click', () => {
						if (answered) return;
						answered = true;
						setState(prev => ({ ...prev, taskCompleted: true }));
						
						if (i === scenario.ans) {
							d.classList.add('correct');
							setScore(13);
							showEndMessage('Perfect ladder positioning! Rescue successful! +13 pts');
						} else {
							d.classList.add('wrong');
							setScore(-5);
							showEndMessage('Unsafe positioning! Hint: ' + scenario.hint);
						}
					});
					choicesDiv.appendChild(d);
				});
			}
		}, 100);

		startTimer(16, () => {
			if (!answered) {
				answered = true;
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(-3);
				const choicesDiv = document.getElementById('ladder-choices');
				if (choicesDiv) {
					const correctChoice = choicesDiv.children[scenario.ans];
					if (correctChoice) correctChoice.classList.add('correct');
				}
				showEndMessage('Time over! Correct answer: ' + scenario.opts[scenario.ans] + '. Ladder failed!');
			}
		});
	};

	// Doctor Task
	const startDoctorTask = () => {
		const cases = [
			{ sym: 'Fever, sore throat, red spots', opts: ['Apply ice, rest', 'Antibiotic after test', 'Give candy'], ans: 1, hint: 'May be a bacterial infection requiring medicine.' },
			{ sym: 'Cough, runny nose, watery eyes', opts: ['Allergy meds & rest', 'Bandage wound', 'Give heavy food'], ans: 0, hint: 'Common allergy/flu symptoms.' },
			{ sym: 'Broken arm after fall', opts: ['Cast & x-ray', 'Give syrup', 'Tell joke'], ans: 0, hint: 'Needs imaging and immobilization.' },
			{ sym: 'Chest pain, shortness of breath', opts: ['Send home with aspirin', 'Call ambulance immediately', 'Give cough medicine'], ans: 1, hint: 'Could be a heart attack - needs emergency care.' },
			{ sym: 'Headache, nausea, sensitivity to light', opts: ['Give painkiller', 'Check for concussion', 'Tell them to sleep'], ans: 1, hint: 'Head injury symptoms need medical evaluation.' },
			{ sym: 'Rash all over body, fever', opts: ['Apply lotion', 'Isolate and call specialist', 'Give antibiotics'], ans: 1, hint: 'Could be contagious - needs isolation and expert care.' },
			{ sym: 'Stomach ache, vomiting', opts: ['Give food', 'Check for food poisoning', 'Ignore it'], ans: 1, hint: 'Food poisoning needs proper diagnosis and treatment.' },
			{ sym: 'Dizzy, pale, weak', opts: ['Give sugar', 'Check blood pressure', 'Tell them to walk'], ans: 1, hint: 'Could be low blood sugar or blood pressure issue.' }
		];
		const c = cases[Math.floor(Math.random() * cases.length)];

		if (playAreaRef.current) {
			playAreaRef.current.innerHTML = `
				<div>
					<div style="font-size:14px;color:#666">Patient symptoms</div>
					<div style="font-weight:700;margin:8px 0">${c.sym}</div>
					<div class="choices" id="choices"></div>
				</div>
			`;
		}

		let answered = false;

		setTimeout(() => {
			const choicesDiv = document.getElementById('choices');
			if (choicesDiv) {
				c.opts.forEach((o, i) => {
					const d = document.createElement('div');
					d.className = 'choice';
					d.textContent = o;
					d.addEventListener('click', () => {
						if (answered) return;
						answered = true;
						setState(prev => ({ ...prev, taskCompleted: true }));
						
						if (i === c.ans) {
							d.classList.add('correct');
							setScore(10);
							showEndMessage('Correct diagnosis — patient will recover! +10 pts');
						} else {
							d.classList.add('wrong');
							setScore(-5);
							showEndMessage('Wrong choice. Hint: ' + c.hint);
						}
					});
					choicesDiv.appendChild(d);
				});
			}
		}, 100);

		startTimer(12, () => {
			if (!answered) {
				answered = true;
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(-3);
				const choicesDiv = document.getElementById('choices');
				if (choicesDiv) {
					const correctChoice = choicesDiv.children[c.ans];
					if (correctChoice) correctChoice.classList.add('correct');
				}
				showEndMessage('Time over! Correct answer: ' + c.opts[c.ans] + '. Patient needs attention!');
			}
		});
	};

	// Teacher Task
	const startTeacherTask = () => {
		const activities = [
			{ q: 'A student is sad because they lost their pencil. What do you do?', opts: ['Ignore', 'Comfort & lend pencil', 'Make fun of them'], ans: 1 },
			{ q: 'Students are noisy before a test. Best action?', opts: ['Start test without warning', 'Explain expectations calmly', 'Yell at everyone'], ans: 1 },
			{ q: 'A group is arguing about turns. What helps?', opts: ['Let the fight continue', 'Teach sharing & take turns', 'Give prize to loudest'], ans: 1 },
			{ q: 'A student is struggling with math. How do you help?', opts: ['Give them the answers', 'Provide extra practice & encouragement', 'Tell them to try harder'], ans: 1 },
			{ q: 'Two students are bullying another. Your response?', opts: ['Ignore it', 'Address it immediately & teach kindness', 'Punish everyone equally'], ans: 1 },
			{ q: 'Class is excited about a field trip. How to manage?', opts: ['Cancel the trip', 'Channel excitement into learning', 'Let them be wild'], ans: 1 },
			{ q: 'A student keeps interrupting lessons. What to do?', opts: ['Ignore them', 'Talk privately & set boundaries', 'Send them out'], ans: 1 },
			{ q: 'Students are confused about homework. Best approach?', opts: ['Give them more homework', 'Explain clearly & offer help', 'Tell them to figure it out'], ans: 1 },
			{ q: 'A student is very shy and never participates. How to help?', opts: ['Force them to speak', 'Encourage gently & create safe space', 'Ignore them'], ans: 1 },
			{ q: 'Class is restless on a hot day. What works?', opts: ['Continue as normal', 'Take a break & do fun activity', 'Make them sit still'], ans: 1 }
		];
		const a = activities[Math.floor(Math.random() * activities.length)];

		if (playAreaRef.current) {
			playAreaRef.current.innerHTML = `
				<div>
					<div style="font-size:14px;color:#666">Scenario</div>
					<div style="font-weight:700;margin:8px 0">${a.q}</div>
					<div class="choices" id="teach-choices"></div>
				</div>
			`;
		}

		let answered = false;

		setTimeout(() => {
			const choicesDiv = document.getElementById('teach-choices');
			if (choicesDiv) {
				a.opts.forEach((o, i) => {
					const d = document.createElement('div');
					d.className = 'choice';
					d.textContent = o;
					d.addEventListener('click', () => {
						if (answered) return;
						answered = true;
						setState(prev => ({ ...prev, taskCompleted: true }));
						
						if (i === a.ans) {
							d.classList.add('correct');
							setScore(12);
							showEndMessage('Great classroom management! +12 pts');
						} else {
							d.classList.add('wrong');
							setScore(-4);
							showEndMessage('Not the best approach — try empathy and rules.');
						}
					});
					choicesDiv.appendChild(d);
				});
			}
		}, 100);

		startTimer(14, () => {
			if (!answered) {
				answered = true;
				setState(prev => ({ ...prev, taskCompleted: true }));
				setScore(-2);
				const choicesDiv = document.getElementById('teach-choices');
				if (choicesDiv) {
					const correctChoice = choicesDiv.children[a.ans];
					if (correctChoice) correctChoice.classList.add('correct');
				}
				showEndMessage('Time ran out! Correct answer: ' + a.opts[a.ans] + '. Class needs guidance!');
			}
		});
	};

	// End message and move on after short delay
	const showEndMessage = (msg) => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		
		if (playAreaRef.current) {
			const overlay = document.createElement('div');
			overlay.style.padding = '12px';
			overlay.style.marginTop = '12px';
			overlay.style.borderTop = '1px dashed #e7f3ff';
			overlay.innerHTML = `<div style="font-weight:700">${msg}</div><div style="margin-top:8px;color:#444;font-size:13px">Click Next Task to continue.</div>`;
			playAreaRef.current.appendChild(overlay);
		}
	};

	// Start the first task automatically
	useEffect(() => {
		assignNextRole();
	}, []);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	return (
		<div className="app">
			<header className="flex gap-4 items-center mb-4">
				<div>
					<h1 className="text-xl font-bold m-0">Community Helpers — Mini-Quests</h1>
					<div className="text-sm text-gray-600">Play roles: Firefighter, Doctor, Teacher — learn community responsibility by completing short challenges.</div>
				</div>
				<div className="ml-auto text-right bg-white rounded-xl p-4 shadow-lg">
					<div className="text-sm text-gray-600">Score</div>
					<div className="font-bold text-lg">{state.score}</div>
					<div className="text-xs text-gray-500 mt-1">Highscore: {state.high}</div>
				</div>
			</header>

			<div className="bg-white rounded-xl p-4 shadow-lg mb-3">
				<div className="flex gap-3">
					<div className={`flex-1 p-3 rounded-lg text-center border-2 cursor-pointer ${state.role === 'fire' ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}>
						🔥 Firefighter
					</div>
					<div className={`flex-1 p-3 rounded-lg text-center border-2 cursor-pointer ${state.role === 'doctor' ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}>
						🩺 Doctor
					</div>
					<div className={`flex-1 p-3 rounded-lg text-center border-2 cursor-pointer ${state.role === 'teacher' ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}>
						📚 Teacher
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
				<div className="bg-white rounded-xl p-4 shadow-lg min-h-80">
					<div ref={playAreaRef} id="play-area">
						<div className="p-4 text-gray-600">
							Welcome! Roles will be assigned automatically. Complete mini-quests to earn points. Each role has simple tasks that teach responsibility and helpfulness. Have fun!
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 shadow-lg">
					<div className="font-bold mb-1">Current Task</div>
					<div id="task-desc" className="text-sm text-gray-600 mb-3">
						{state.role ? `${state.role === 'fire' ? 'Firefighter' : state.role === 'doctor' ? 'Doctor' : 'Teacher'}: Complete your mini-quest!` : 'Choose a role to begin your mini-quest.'}
					</div>

					<div className="mb-3">
						<div className="text-sm text-gray-600">Time left</div>
						<div className="h-4 bg-blue-100 rounded-lg mt-2 overflow-hidden">
							<div id="timer-bar" className="h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-100" style={{ width: '0%' }}></div>
						</div>
						<div className="mt-2 flex gap-2 items-center">
							<div id="time-left" className="text-sm">--</div>
							<button 
								className="px-2 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
								onClick={() => {
									setScore(-5);
									nextTask();
								}}
							>
								Skip (-5 pts)
							</button>
						</div>
					</div>

					<div className="mb-3">
						<div className="text-sm text-gray-600">Guide</div>
						<ul className="pl-4 mt-1 text-gray-600 text-sm space-y-1">
							<li>Complete mini-quests quickly to earn points.</li>
							<li>Good choices give +10, helpful actions +15, skipping costs -5.</li>
							<li>Your highscore is saved locally in this browser.</li>
						</ul>
					</div>

					<div className="text-center space-y-2">
						<button 
							className="w-full px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
							onClick={nextTask}
						>
							Next Task
						</button>
						<button 
							className="w-full px-2 py-1 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm"
							onClick={resetScore}
						>
							Reset Score
						</button>
					</div>
				</div>
			</div>

			<footer className="mt-3 text-center text-gray-600 text-sm">
				Made for learning — adapt or expand the mini-quests as you like!
			</footer>

			<style jsx>{`
				.fire-row {
					display: flex;
					gap: 8px;
					align-items: center;
				}
				.progress {
					height: 16px;
					background: #eef6ff;
					border-radius: 10px;
					margin-top: 8px;
					overflow: hidden;
				}
				.progress > i {
					display: block;
					height: 100%;
					background: linear-gradient(90deg, #1e90ff, #3ad0ff);
					width: 0%;
				}
				.choices {
					display: flex;
					flex-direction: column;
					gap: 8px;
				}
				.choice {
					padding: 10px;
					border-radius: 10px;
					border: 1px solid #e6eef8;
					cursor: pointer;
					transition: all 0.2s;
				}
				.choice:hover {
					background: #f8fafc;
				}
				.choice.correct {
					background: rgba(45, 179, 74, 0.08);
					border-color: rgba(45, 179, 74, 0.2);
				}
				.choice.wrong {
					background: rgba(255, 107, 107, 0.08);
					border-color: rgba(255, 107, 107, 0.2);
				}
				.btn {
					display: inline-block;
					padding: 8px 12px;
					border-radius: 8px;
					background: #1e90ff;
					color: #fff;
					text-decoration: none;
					cursor: pointer;
					border: none;
					transition: background 0.2s;
				}
				.btn:hover {
					background: #0066cc;
				}
			`}</style>
		</div>
	);
}
