import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { LoadingSpinner } from './Loading';
import type { Course, CreateCourseRequest } from '../types';
import { apiService } from '../services/apiService';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: CreateCourseRequest) => Promise<void>;
  course?: Course | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnailUrl: '',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const isEditing = !!course;

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnailUrl: course.thumbnailUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        thumbnailUrl: '',
      });
    }
    setErrors({});
  }, [course, isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set default categories if API fails
      setCategories([
        'Programming',
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Design',
        'Business',
        'Marketing',
        'Other'
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
      setErrors({ submit: 'Failed to save course. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Course' : 'Create New Course'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.submit}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Course Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter course title"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          {loadingCategories ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-500">Loading categories...</span>
            </div>
          ) : (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Course Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a detailed course description (minimum 50 characters)"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length}/50 characters minimum
          </p>
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL (optional)
          </label>
          <input
            type="url"
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.thumbnailUrl ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.thumbnailUrl && <p className="text-red-600 text-sm mt-1">{errors.thumbnailUrl}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
            {isEditing ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseModal;
