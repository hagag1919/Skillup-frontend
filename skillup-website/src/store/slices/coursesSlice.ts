import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  Course, 
  CourseFilters, 
  PaginatedResponse,
  CreateCourseData,
  UpdateCourseData,
  Module,
  Lesson
} from '../../types/index.js';
import { coursesApi, instructorCoursesApi } from '../../api/courses.js';

interface CoursesState {
  // Public courses
  courses: Course[];
  coursesPagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  currentCourse: Course | null;
  categories: string[];
  
  // Instructor courses
  instructorCourses: Course[];
  instructorCoursesPagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  currentInstructorCourse: Course | null;
  
  // Modules and lessons
  currentModules: Module[];
  currentLessons: Lesson[];
  
  // Loading states
  loading: boolean;
  categoriesLoading: boolean;
  instructorCoursesLoading: boolean;
  
  // Error states
  error: string | null;
  categoriesError: string | null;
  instructorCoursesError: string | null;
}

const initialState: CoursesState = {
  courses: [],
  coursesPagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  currentCourse: null,
  categories: [],
  
  instructorCourses: [],
  instructorCoursesPagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  currentInstructorCourse: null,
  
  currentModules: [],
  currentLessons: [],
  
  loading: false,
  categoriesLoading: false,
  instructorCoursesLoading: false,
  
  error: null,
  categoriesError: null,
  instructorCoursesError: null,
};

// Public course thunks
export const fetchCourses = createAsyncThunk<
  PaginatedResponse<Course>,
  CourseFilters | undefined,
  { rejectValue: string }
>(
  'courses/fetchCourses',
  async (filters, { rejectWithValue }) => {
    try {
      return await coursesApi.getAllCourses(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk<
  Course,
  number,
  { rejectValue: string }
>(
  'courses/fetchCourseById',
  async (courseId, { rejectWithValue }) => {
    try {
      return await coursesApi.getCourseById(courseId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch course');
    }
  }
);

export const fetchCategories = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>(
  'courses/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await coursesApi.getAllCategories();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const searchCourses = createAsyncThunk<
  Course[],
  string,
  { rejectValue: string }
>(
  'courses/searchCourses',
  async (keyword, { rejectWithValue }) => {
    try {
      return await coursesApi.searchCourses(keyword);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search courses');
    }
  }
);

// Instructor course thunks
export const fetchInstructorCourses = createAsyncThunk<
  PaginatedResponse<Course>,
  { page?: number; size?: number },
  { rejectValue: string }
>(
  'courses/fetchInstructorCourses',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      return await instructorCoursesApi.getMyCourses(page, size);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch instructor courses');
    }
  }
);

export const createCourse = createAsyncThunk<
  Course,
  CreateCourseData,
  { rejectValue: string }
>(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      return await instructorCoursesApi.createCourse(courseData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk<
  Course,
  { courseId: number; courseData: UpdateCourseData },
  { rejectValue: string }
>(
  'courses/updateCourse',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      return await instructorCoursesApi.updateCourse(courseId, courseData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'courses/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      await instructorCoursesApi.deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete course');
    }
  }
);

export const fetchCourseModules = createAsyncThunk<
  Module[],
  number,
  { rejectValue: string }
>(
  'courses/fetchCourseModules',
  async (courseId, { rejectWithValue }) => {
    try {
      return await instructorCoursesApi.getCourseModules(courseId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch course modules');
    }
  }
);

// Courses slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.categoriesError = null;
      state.instructorCoursesError = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearCurrentInstructorCourse: (state) => {
      state.currentInstructorCourse = null;
    },
    clearCurrentModules: (state) => {
      state.currentModules = [];
    },
    updateCourseInList: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      
      const instructorIndex = state.instructorCourses.findIndex(course => course.id === action.payload.id);
      if (instructorIndex !== -1) {
        state.instructorCourses[instructorIndex] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.content;
        state.coursesPagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch courses';
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch course';
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload || 'Failed to fetch categories';
      });

    // Search courses
    builder
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
      });

    // Instructor courses
    builder
      .addCase(fetchInstructorCourses.pending, (state) => {
        state.instructorCoursesLoading = true;
        state.instructorCoursesError = null;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        state.instructorCoursesLoading = false;
        state.instructorCourses = action.payload.content;
        state.instructorCoursesPagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.instructorCoursesLoading = false;
        state.instructorCoursesError = action.payload || 'Failed to fetch instructor courses';
      });

    // Create course
    builder
      .addCase(createCourse.fulfilled, (state, action) => {
        state.instructorCourses.unshift(action.payload);
        state.instructorCoursesPagination.totalElements += 1;
      });

    // Update course
    builder
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.instructorCourses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.instructorCourses[index] = action.payload;
        }
        if (state.currentInstructorCourse?.id === action.payload.id) {
          state.currentInstructorCourse = action.payload;
        }
      });

    // Delete course
    builder
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.instructorCourses = state.instructorCourses.filter(course => course.id !== action.payload);
        state.instructorCoursesPagination.totalElements -= 1;
        if (state.currentInstructorCourse?.id === action.payload) {
          state.currentInstructorCourse = null;
        }
      });

    // Fetch course modules
    builder
      .addCase(fetchCourseModules.fulfilled, (state, action) => {
        state.currentModules = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentCourse,
  clearCurrentInstructorCourse,
  clearCurrentModules,
  updateCourseInList,
} = coursesSlice.actions;

export default coursesSlice.reducer;
