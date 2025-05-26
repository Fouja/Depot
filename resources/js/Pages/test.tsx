import React from "react";

function test() {
    return (
        <main className="mt-32">
            <div className="text-center text-6xl font-semibold">
                This project use
            </div>
            <ul className="flex gap-32 justify-center mt-6 text-2xl">
                <li className="flex flex-col items-center">
                    Laravel{" "}
                    <img
                        className="logo-start"
                        src="https://images.seeklogo.com/logo-png/36/1/laravel-logo-png_seeklogo-363134.png"
                    />{" "}
                </li>
                <li className="flex flex-col items-center">
                    React TypeScript
                    <img
                        className="logo-start"
                        src="https://images.seeklogo.com/logo-png/29/1/typescript-logo-png_seeklogo-298572.png"
                    />
                </li>
                <li className="flex flex-col items-center">
                    Inertia
                    <img
                        className="logo-start"
                        src="https://avatars.githubusercontent.com/u/47703742?s=280&v=4"
                    />
                </li>
            </ul>
        </main>
    );
}

export default test;
