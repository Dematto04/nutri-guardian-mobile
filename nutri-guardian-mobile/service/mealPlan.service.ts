import api from "@/config/api";

interface MealPlanCreateRequest {
    name: string;
    startDate: string;
    endDate: string;
    notes: string;
}
interface MealPlanEntryRequest {
    "mealPlanId": string | number,
    "mealDate": string | Date,
    "mealType": number | string | undefined,
    "recipeId": number,
    "servings": number,
    "notes": string
}

class MealPlanServiceBase {
    private readonly pathUrl = "mealplans"

    getMealPlan() {
        return api.get(`${this.pathUrl}`)
    }

    createMealPlan(mealPlanData: MealPlanCreateRequest) {
        return api.post(`${this.pathUrl}`, { ...mealPlanData, planType: "string" });
    }
    getMealPlanDetail(id: string) {
        return api.get(`${this.pathUrl}/${id}`)
    }

    mealPlanEntries(mealPlanId: string | number, body: MealPlanEntryRequest) {
        return api.post(`${this.pathUrl}/${mealPlanId}/entries`, body)
    }
}

export const MealPlanService = new MealPlanServiceBase()