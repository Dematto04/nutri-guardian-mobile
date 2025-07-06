import api from "@/config/api";

interface MealPlanCreateRequest {
    name: string;
    startDate: string;
    endDate: string;
    notes: string;
}

class MealPlanServiceBase {
    private readonly pathUrl = "mealplans"

    getMealPlan(){
        return api.get(`${this.pathUrl}`)
    }

    createMealPlan(mealPlanData: MealPlanCreateRequest) {
        return api.post(`${this.pathUrl}`, {...mealPlanData, planType: "string"});
    }
     getMealPlanDetail(id: string){
        return api.get(`${this.pathUrl}/${id}`)
    }
} 

export const MealPlanService = new MealPlanServiceBase()