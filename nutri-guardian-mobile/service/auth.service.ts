import api from "@/config/api";


class AuthServiceBase {
    private readonly pathUrl = "authentication"

    async login(form: {
        email: string,
        password: string
    }) {
        return api.post(`/${this.pathUrl}/login`, form)
    }
}

export const AuthService = new AuthServiceBase()