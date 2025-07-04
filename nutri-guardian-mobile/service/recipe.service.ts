import api from "@/config/api"
import { RecipeDetailResponseDto } from "@/dtos/recipe/recipe.dto"

class RecipeServiceBase {
    private readonly pathUrl = "recipes"
    
    async getRecipeCategories(){
        return api.get(`${this.pathUrl}/filter-options`)
    }
    async getRecipes(cate: string){
        return api.get(`${this.pathUrl}/search?IngredientCategory=${new URLSearchParams(cate)}`)
    }
    async getRecipeById(id: string): Promise<RecipeDetailResponseDto>{
        return api.get(`${this.pathUrl}/${id}`)
    }
}

export const RecipeService = new RecipeServiceBase()