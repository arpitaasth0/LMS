
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:6060/api/v1/course";

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes:["Refetch_Creator_Course","Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "/",
                method: "POST",
                body: { courseTitle, category },
            }),
            invalidatesTags:['Refetch_Creator_Course']

        }),
        getSearchCourse:builder.query({
            query:({searchQuery,categories,sortByPrice}) => {
                //build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

                //append category
                if(categories && categories.length){
                    const categoriesString = categories.map(encodeURIComponent).join(",");
                    queryString += `&categories=${categoriesString}`;
                }

                //append sortbyprice is available
                if(sortByPrice){
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }
                

                return {
                    url:queryString,
                    method:"GET",
                    
                }
            }
        }),


        getPublishedCourse: builder.query({
            query: () => ({
              url: "/published-courses",
              method: "GET",
            }),
          }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
                
            }),
            invalidatesTags:['Refetch_Creator_Course']

        }),
        editCourse:builder.mutation({
            query:({formData,courseId}) => ({
                url:`/${courseId}`,
                method:"PUT",
                body:formData,
                formData:true,
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),
        getCourseById:builder.query({
            query:(courseId) => ({
                url:`/${courseId}`,
                method:"GET"
                
            }),
            invalidatesTags:['Refetch_Creator_Course']
        }),
        createLecture:builder.mutation({
            query:({lectureTitle,courseId}) => ({
                url:`/${courseId}/lecture`,
                method:"POST",
                body:{lectureTitle}
            })
        }),
        getCourseLecture:builder.query({
            query:(courseId) => ({
                url:`/${courseId}/lecture`,
                method:"GET",
                
            }),
            providesTags:["Refetch_Lecture"]
        }),
        editLecture: builder.mutation({
            query: ({ lectureTitle, videoInfo, isPreviewFree, courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree }, // ✅ Correct format
            }),
        }),
        
        removeLecture: builder.mutation({
            query: ({ lectureId }) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Lecture"]
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
              url: `/lecture/${lectureId}`,
              method: "GET",
            }),
          }),
          publishCourse: builder.mutation({
            query: ({ courseId, publish }) => ({
              url: `/${courseId}?publish=${publish}`, // Removed space
              method: "PATCH", // Use PUT if needed
            }),
          }),
          
        

    })
})

export const {
    useCreateCourseMutation,
    useGetSearchCourseQuery,
    useGetPublishedCourseQuery,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation
} = courseApi;

