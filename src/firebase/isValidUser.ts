import { User } from "firebase/auth";

 export function isValidUser(user: User|null): boolean {
    if (user) {
        // User object exists
        // Add additional validation logic if needed
        if(user.emailVerified) return true
        else return false
    } else {
        // User object does not exist
        return false;
    }
}