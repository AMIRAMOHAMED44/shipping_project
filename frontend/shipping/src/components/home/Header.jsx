export default function Header({ setView }) {
    return (
        <header className="bg-teal-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
                <h1 className="text-2xl font-bold">ShipSwift</h1>

                <nav className="space-x-4">
                    <button onClick={() => setView("home")} className="hover:underline">Home</button>
                    <button onClick={() => setView("login")} className="hover:underline">Login</button>
                    <button onClick={() => setView("register")} className="hover:underline">Register</button>
                </nav>
            </div>
        </header>
    );
}

