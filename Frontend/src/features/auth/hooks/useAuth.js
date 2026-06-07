import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({ email, password });

            setUser(data.user);

            return {
                success: true
            };

        } catch (error) {

            throw error;

        } finally {
            setLoading(false);
        }
    };

   const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
        const data = await register({
            username,
            email,
            password
        });

        setUser(data.user);

        return {
            success: true
        };

    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
};

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (error) {
            console.log(error)
            throw error;
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                // Use optional chaining or a null check to prevent the crash
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {

                if (error?.response?.status === 401) {
                    setUser(null);
                    return;
                }

                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setUser, setLoading]);

    return { user, loading, handleRegister, handleLogin, handleLogout }
}