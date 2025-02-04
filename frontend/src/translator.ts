const translator = (original: string) => {
    if(original === "Forbidden") return "Nie masz uprawnień aby to zrobić";
    if(original === "Unauthorized") return "Zaloguj się ponownie";

    if(original === "Registration failed") return "Nie udało się zarejestrować";
    if(original === "Login failed") return "Nie udało się zalogować";
    if(original === "Email, password and captcha are required") return "Musisz podać email, hasło i kod z obrazka";
    if(original === "Wrong captcha") return "Zły kod z obrazka";
    if(original === "User registered successfully") return "Pomyślnie zarejestrowano użytkownika";
    if(original === "Error creating user") return "Nie udało się utworzyć użytkownika";
    if(original === "User not activated") return "Użytkownik nie został aktywowany lub nie istnieje";
    if(original === "Invalid credentials") return "Złe hasło";
    if(original === "Wrong activation key") return "Zły kod aktywacji (może użytkownik już aktywowany?)";
    if(original === "Error logging out") return "Nie udało się wylogować";
    if(original === "Logout successful") return "Wylogowano";

    if(original === "team with this name already exists") return "Jednostka o takiej nazwie już istnieje";
    if(original === "district not found") return "Nie ma takiej chorągwi";

    return original;
};

export default translator;