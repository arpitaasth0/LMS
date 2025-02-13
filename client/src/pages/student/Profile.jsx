import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Course from './Course';

const Profile = () => {
    const [name, setName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    const { data, error, isLoading ,refetch} = useLoadUserQuery();
    const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error: updateUserError, isSuccess }] =
        useUpdateUserMutation();

    useEffect(() => {
        if (data?.user) {
            setName(data.user.name);
        }
    }, [data]); // ✅ Ensures name is set once data loads

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(updateUserData?.message || 'Profile updated.');
        }
        if (isError) {
            toast.error(updateUserError?.message || 'Failed to update profile.');
        }
    }, [isSuccess, isError]); // ✅ Fixed dependency list

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    };

    const updateUserHandler = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        useEffect(() => {
               refetch();
        },[])

        const formData = new FormData();
        formData.append('name', name);
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }

        try {
            await updateUser(formData).unwrap();
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed.');
        }
    };

    // ✅ Move conditional returns *after* hooks to avoid errors
    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error.message || 'Failed to load user'}</h1>;
    if (!data || !data.user) return <h1>User data is not available</h1>;

    const  user  = data && data.user;

    return (
        <div className="my-24 max-w-4xl px-4 mx-auto">
            <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage src={user?.photoUrl || 'https://github.com/shadcn.png'} alt="Profile Picture" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100">Name:</h1>
                        <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.name}</span>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100">Email:</h1>
                        <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.email}</span>
                    </div>
                    <div className="mb-2">
                        <h1 className="font-semibold text-gray-900 dark:text-gray-100">Role:</h1>
                        <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.role.toUpperCase()}</span>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-2">
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Name</Label>
                                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Profile photo</Label>
                                    <Input type="file" onChange={onChangeHandler} accept="image/*" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                                    {updateUserIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin">Please wait</Loader2> : 'Save changes'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                    {user.enrolledCourses.length === 0 ? <h1>You haven't enrolled yet</h1> : user.enrolledCourses.map((course) => <Course course={course} key={course._id} />)}
                </div>
            </div>
        </div>
    );
};

export default Profile;
