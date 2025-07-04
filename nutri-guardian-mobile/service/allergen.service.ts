import api from "@/config/api"
import { AllergenResponse } from "@/dtos/allergen/allergen.response.dto"

class AllergenServiceBase {
    private readonly urlPath = "/allergen"

    async getAllAllergen(): Promise<AllergenResponse>{
        return api.get(`${this.urlPath}`)
    }
}

export const AllergenService = new AllergenServiceBase()