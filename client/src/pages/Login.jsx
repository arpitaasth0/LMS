//k72TsOWryHfJ3s2t

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    useLoginUserMutation,
    useRegisterUserMutation,
  } from "@/features/api/authApi";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {toast} from "sonner";
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [SignupInput, setSignupInput] = useState({ name: "", email: "", password: "" });
    const [LoginInput, setLoginInput] = useState({ email: "", password: "" });

    const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIssuccess }] = useRegisterUserMutation()
    const [loginUser, {data:loginData, error:loginError,isLoading:loginIsLoading,isSuccess:loginIsSuccess}] = useLoginUserMutation()

    const navigate = useNavigate();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({ ...SignupInput, [name]: value });
        } else {
            setLoginInput({ ...LoginInput, [name]: value });
        }
    }

    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? SignupInput : LoginInput;
        const action = type === "signup" ? registerUser:loginUser;
        await action(inputData);
        
    };

    useEffect(() => {
        if (registerIssuccess && registerData) {
            toast.success(registerData?.message || "Signup successful.");
        }
        if (registerError) {
            toast.error(registerError?.data?.message || registerError?.error || "Signup Failed");
        }
        if (loginIsSuccess && loginData) {
            toast.success(loginData?.message || "Login successful.");
            navigate("/");
        }
        if (loginError) {
            toast.error(loginError?.data?.message || loginError?.error || "Login Failed");
        }
    }, [loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError]);
    return (
        <div className="flex items-center w-full justify-center mt-20">

            <Tabs defaultValue="Login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="Login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <br></br>
                                <Label htmlFor="name">Name</Label>
                                <br></br>
                                <Input type="text"
                                    name="name"
                                    value={SignupInput.value}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Eg.patel"
                                    required={true} />
                            </div>
                            <div className="space-y-1">
                                <br></br>
                                <Label htmlFor="email">Email</Label>
                                <br></br>
                                <Input type="email"
                                    name="email"
                                    value={SignupInput.email}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Eg.patel@gmail.com"
                                    required={true} />
                            </div>
                            <div className="space-y-1">
                                <br></br>
                                <Label htmlFor="password">Password</Label>
                                <br></br>
                                <Input type="password"
                                    name="password"
                                    value={SignupInput.password}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Eg.xyz"
                                    required={true} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <br></br>
                            <Button  disabled ={registerIsLoading} onClick={() => handleRegistration("signup")}>
                            {
                                    registerIsLoading ? (
                                        <>
                                        <Loader2 className = "mr-2 h-4 w-4 animate-spin"/>please wait
                                        </>
                                       
                                    ) :"Signup"
                                }
                               </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="Login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here.after signup,you'll be logged in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <br></br>
                                <Label htmlFor="current">Email</Label>
                                <br></br>
                                <Input type="email"
                                    name="email"
                                    value={LoginInput.email}
                                    onChange={(e) => changeInputHandler(e, "Login")}
                                    placeholder="Eg.patel@gmail.com"
                                    required={true} />
                            </div>
                            <div className="space-y-1">
                                <br></br>
                                <Label htmlFor="new">Password</Label>
                                <br></br>
                                <Input type="password"
                                    name="password"
                                    value={LoginInput.password}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    placeholder="Eg.xyz"
                                    required={true} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <br></br>
                            <Button disabled = {loginIsLoading} onClick={() => handleRegistration("Login")}>
                                {
                                    loginIsLoading ? (
                                        <>
                                        <Loader2 className = "mr-2 h-4 w-4 animate-spin"/>please wait
                                        </>
                                       
                                    ) :"Login"
                                }
                                </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

    )
}

export default Login

