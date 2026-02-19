import React from 'react'
import { useState } from 'react'
import '../App.css';
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import Home from './Home'



const Quiz = () => {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    console.log(data)
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.warn("Fullscreen request denied:", err);
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    };

    useEffect(() => {
        handleFullScreen();

        const handleFullScreenChange = () => {
            const isFullScreen = document.fullscreenElement != null;
            console.log("Fullscreen change detected. Current state:", isFullScreen);

            if (!isFullScreen) {
                navigate('/Home', { state: { ...data, id: 0 } });
            }
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, []);


    const questions = [
        {
            question: "Which of the following is not a unit of energy??",
            options: ["Joule", "Calorie", "Watt", "EV"],
            correct: "Watt",
        },
        {
            question: "In a crystal, the shortest distance between two similar atoms is called the:?",
            options: ["Interatomic spacing",
                "Atomic number",
                "Atomic radius",
                "Lattice constant"],
            correct: "Lattice constant",
        },
        {
            question: "Which law explains the phenomenon of interference of light??",
            options: [
                "Newton’s Law of Cooling", "Hooke’s Law", "Principle of Superposition", "Coulomb’s Law"
            ],
            correct: "Principle of Superposition",
        },
        {
            question: "What is the primary cause of superconductivity in materials??",
            options: ["Free movement of electrons", "Absence of thermal vibrations", "Formation of Cooper pairs", "Increase in magnetic fiel"],
            correct: "Formation of Cooper pairs",
        },
    ];

    const handleChange = (qIndex, option) => {
        setAnswers({ ...answers, [qIndex]: option });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let count = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correct) count++;
        });
        setScore(count);
        setSubmitted(true);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (document.getElementById("reader")) {
                const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

                scanner.render(
                    async (decodedText, decodedResult) => {
                        console.log("QR Code:", decodedText);

                        scanner.clear().then(() => {
                            console.log("Scanner cleared.");
                            alert("Attendance Marked as Present!!");
                            navigate('/Home', { state: { id: 0, email: data?.email } });
                        });
                    },
                    (error) => {
                        console.warn("QR error:", error);
                    }
                );
            } else {
                console.error("Scanner div not found!");
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, []);


    return (
        <div>
            <Navbar data={data?.email} />

            <div className="quiz-container">
                <h2>Welcome to the Quiz!</h2>

                <form onSubmit={handleSubmit}>
                    {questions.map((q, index) => (
                        <div key={index} className="question-block">
                            <p><strong>Q{index + 1}: {q.question}</strong></p>
                            {q.options.map((opt, i) => (
                                <label key={i} className="option">
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={opt}
                                        onChange={() => handleChange(index, opt)}
                                        disabled={submitted}
                                        required
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ))}

                    {!submitted && <button type="submit">Submit Quiz</button>}
                </form>
                {submitted && (
                    <div className="result">
                        <h3>Your Score: {score} / {questions.length}</h3>
                        <p>{score}</p>
                    </div>
                )}
            </div>
            <div id="reader" />
        </div>)
}

export default Quiz
