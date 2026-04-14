import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import { 
  ArrowLeft, Type, AlignLeft, Image as ImageIcon, FolderOpen, 
  Edit3, Eye, Loader2, Settings, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, Save, Upload
} from 'lucide-react';

const publishingTips = [
  {
    icon: <Type className="w-5 h-5 text-primary" />,
    title: 'Compelling Title',
    description: 'Write a title that grabs attention and clearly describes your content'
  },
  {
    icon: <AlignLeft className="w-5 h-5 text-primary" />,
    title: 'Engaging Description',
    description: 'Keep your description concise and make readers want to continue'
  },
  {
    icon: <ImageIcon className="w-5 h-5 text-primary" />,
    title: 'Quality Image',
    description: 'Add a high-quality featured image that represents your content'
  },
  {
    icon: <FolderOpen className="w-5 h-5 text-primary" />,
    title: 'Right Category',
    description: 'Choose the most relevant category for better discoverability'
  },
  {
    icon: <Edit3 className="w-5 h-5 text-primary" />,
    title: 'Clear Formatting',
    description: 'Use clear paragraphs and formatting for better readability'
  }
];

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    data: '',
    categoryId: '',
    postImage: ''
  });

  const [categories, setCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setCategoriesLoading(true);
    api.get('/api/category')
      .then(res => {
        const categoriesData = res.data.categories || res.data.data || res.data || [];
        setCategories(categoriesData);
      })
      .catch(() => setSnackbar({ open: true, message: 'Failed to fetch categories', severity: 'error' }))
      .finally(() => setCategoriesLoading(false));
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsDirty(true);
    if (error) setError('');
  };

  const handleEditorChange = (value) => {
    setFormData(prev => ({ ...prev, data: value || '' }));
    setIsDirty(true);
    if (error) setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await api.post('/api/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData(prev => ({ ...prev, postImage: response.data.url }));
      setIsDirty(true);
      setSnackbar({ open: true, message: 'Image uploaded successfully!', severity: 'success' });
    } catch (err) {
      console.error('Image upload failed', err);
      setSnackbar({ open: true, message: 'Image upload failed', severity: 'error' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditorImageDrop = async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      const response = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data.url;
      setFormData(prev => ({ ...prev, data: prev.data + `\n\n![Uploaded Image](${imageUrl} "width=100%")\n` }));
      setIsDirty(true);
      setSnackbar({ open: true, message: 'Image added to post content!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Image upload to editor failed', severity: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.data || !formData.categoryId) {
      setError('Please fill in all required fields');
      setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/api/posts/user/${user.id}/category/${formData.categoryId}`, formData);
      setSnackbar({ open: true, message: 'Post created successfully!', severity: 'success' });
      const postId = response.data?.data?.id || response.data?.data?.postId || response.data?.id;
      setFormData({ title: '', description: '', data: '', categoryId: '', postImage: '' });
      setIsDirty(false);
      
      setTimeout(() => {
        // Navigate to the correct post detail route
        if (postId) {
          navigate(`/posts/${postId}`);
        } else {
          navigate('/posts');
        }
      }, 1500);
    } catch (error) {
      console.error('Error creating post:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to create post. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mainCategories = categories.filter(cat => !cat.parentCategory);
  const subCategories = selectedMainCategory 
      ? categories.filter(cat => cat.parentCategory?.id === parseInt(selectedMainCategory))
      : [];

  const selectedCategoryObj = categories.find(cat => String(cat.id) === String(formData.categoryId));
  const wordCount = formData.data ? formData.data.split(/\s+/).filter(word => word.length > 0).length : 0;
  const charCount = formData.data ? formData.data.length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const getValidationStatus = () => {
    const hasTitle = formData.title.trim().length > 0;
    const hasContent = formData.data.trim().length > 0;
    const hasCategory = formData.categoryId !== '';
    const hasDescription = formData.description.trim().length > 0;
    const hasImage = formData.postImage.trim().length > 0;

    return {
      title: hasTitle,
      content: hasContent,
      category: hasCategory,
      description: hasDescription,
      image: hasImage,
      isComplete: hasTitle && hasContent && hasCategory
    };
  };

  const validation = getValidationStatus();

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/posts')}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </button>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Share your thoughts with the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden p-6 sm:p-8">
              {!previewMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Post Stats */}
                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Post Statistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-foreground">{wordCount}</p>
                        <p className="text-xs text-muted-foreground">Words</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-foreground">{charCount}</p>
                        <p className="text-xs text-muted-foreground">Characters</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-foreground">{readingTime}</p>
                        <p className="text-xs text-muted-foreground">Min Read</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xl font-bold ${validation.isComplete ? 'text-green-500' : 'text-red-500'}`}>
                          {validation.isComplete ? 'Ready' : 'Draft'}
                        </p>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                    </div>
                  </div>

                  {/* Title Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">
                      Post Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a compelling title for your post..."
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-lg font-medium"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">
                      Post Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Write a brief description of your post..."
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background/50 text-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Cover Photo Field in Main Form */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground block">
                      Cover Photo
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group">
                        {formData.postImage ? (
                          <>
                            <img src={formData.postImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                               <Edit3 className="w-6 h-6 text-foreground drop-shadow-md z-10" />
                               <p className="mt-2 text-sm text-foreground font-semibold drop-shadow-md z-10">Change Cover Photo</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                             {isUploadingImage ? (
                               <><Loader2 className="w-8 h-8 mb-3 text-muted-foreground animate-spin" /><p className="text-sm text-muted-foreground">Uploading...</p></>
                             ) : (
                               <><Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                               <p className="mb-2 text-sm font-semibold text-muted-foreground">Click to upload cover photo</p>
                               <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p></>
                             )}
                          </div>
                        )}
                        
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Content Field replaced with MD Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-foreground block">
                        Post Content <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs font-normal text-muted-foreground hidden sm:inline">(Drag & Drop images here)</span>
                      </label>
                      
                      <label className="cursor-pointer text-xs flex items-center px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors border border-border">
                        {isUploadingImage ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin"/> : <Upload className="w-3 h-3 mr-1.5"/>}
                        Upload Image
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEditorImageDrop(file);
                            e.target.value = null; // reset to allow same file upload again
                          }}
                          disabled={isUploadingImage}
                        />
                      </label>
                    </div>

                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => e.preventDefault()}
                      onPaste={(e) => {
                        const file = e.clipboardData?.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                            e.preventDefault();
                            handleEditorImageDrop(file);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer?.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                            handleEditorImageDrop(file);
                        }
                      }}
                      className="border border-input rounded-lg overflow-hidden group relative"
                    >
                      <div data-color-mode="light" className="dark:hidden">
                         <MDEditor
                           value={formData.data}
                           onChange={handleEditorChange}
                           height={450}
                           className="!border-none !bg-background"
                           components={{
                             img: ({ src, alt, title }) => {
                               let width = '100%';
                               if (title && title.startsWith('width=')) width = title.replace('width=', '');
                               return <img src={src} alt={alt} style={{ width, margin: '10px auto' }} className="rounded-lg shadow-sm" />;
                             }
                           }}
                         />
                      </div>
                      <div data-color-mode="dark" className="hidden dark:block">
                         <MDEditor
                           value={formData.data}
                           onChange={handleEditorChange}
                           height={450}
                           className="!border-none !bg-background"
                           components={{
                             img: ({ src, alt, title }) => {
                               let width = '100%';
                               if (title && title.startsWith('width=')) width = title.replace('width=', '');
                               return <img src={src} alt={alt} style={{ width, margin: '10px auto' }} className="rounded-lg shadow-sm" />;
                             }
                           }}
                         />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-border mt-8">
                    <button
                      type="button"
                      onClick={handlePreviewToggle}
                      className="flex items-center px-5 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
                    >
                      {previewMode ? (
                        <><Edit3 className="w-4 h-4 mr-2" /> Exit Preview</>
                      ) : (
                        <><Eye className="w-4 h-4 mr-2" /> Preview Post</>
                      )}
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!isDirty || isLoading || !validation.isComplete}
                      className="flex items-center px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
                      ) : (
                        <><Save className="w-4 h-4 mr-2" /> Publish Post</>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  {/* Exit Preview Button */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <span className="text-sm italic text-muted-foreground font-medium px-3 py-1 bg-muted rounded-full">Preview Mode</span>
                    <button
                      onClick={handlePreviewToggle}
                      className="flex items-center px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted text-foreground transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Exit Preview
                    </button>
                  </div>
                  
                  {selectedCategoryObj && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
                      <FolderOpen className="w-3.5 h-3.5 mr-1" />
                      {selectedCategoryObj.name}
                    </span>
                  )}
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight text-foreground">
                    {formData.title || 'Your Post Title'}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {formData.description || 'Your post description will appear here...'}
                  </p>
                  
                  {formData.postImage && (
                    <div className="mb-10 rounded-2xl overflow-hidden bg-muted border border-border/50">
                      <img 
                        src={formData.postImage} 
                        alt="preview" 
                        className="w-full max-h-[500px] object-cover" 
                      />
                    </div>
                  )}
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>
                      {formData.data || 'Your post content will appear here...'}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Settings Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 line-clamp-2">
              <h3 className="flex items-center text-lg font-semibold mb-6 pb-4 border-b border-border text-foreground">
                <Settings className="w-5 h-5 mr-2 text-foreground" /> 
                Post Settings
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Main Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedMainCategory}
                    onChange={(e) => {
                      setSelectedMainCategory(e.target.value);
                      setFormData({ ...formData, categoryId: e.target.value });
                    }}
                    disabled={categoriesLoading}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>Select a main category</option>
                    {mainCategories.length === 0 && <option value="" disabled>No categories available</option>}
                    {mainCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {subCategories.length > 0 && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-foreground">
                      Subcategory
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      disabled={categoriesLoading}
                      className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${validation.category ? 'border-border' : 'border-red-500'}`}
                    >
                      <option value={selectedMainCategory}>None (Use Main Category)</option>
                      {subCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Cover Photo Input removed from Sidebar to Main Form */}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h3 className="flex items-center text-lg font-semibold mb-5 pb-4 border-b border-border text-foreground">
                <CheckCircle2 className="w-5 h-5 mr-2 text-foreground" /> 
                Requirements
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                  <span className="flex items-center text-foreground font-medium">
                    {validation.title ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <AlertCircle className="w-4 h-4 text-red-500 mr-2" />}
                    Title
                  </span>
                  <span className="text-xs text-muted-foreground">{validation.title ? 'Completed' : 'Required'}</span>
                </li>
                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                  <span className="flex items-center text-foreground font-medium">
                    {validation.content ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <AlertCircle className="w-4 h-4 text-red-500 mr-2" />}
                    Content
                  </span>
                  <span className="text-xs text-muted-foreground">{validation.content ? 'Completed' : 'Required'}</span>
                </li>
                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                  <span className="flex items-center text-foreground font-medium">
                    {validation.category ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <AlertCircle className="w-4 h-4 text-red-500 mr-2" />}
                    Category
                  </span>
                  <span className="text-xs text-muted-foreground">{validation.category ? 'Selected' : 'Required'}</span>
                </li>
                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                  <span className="flex items-center text-foreground font-medium">
                    {validation.description ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <Info className="w-4 h-4 text-blue-500 mr-2" />}
                    Description
                  </span>
                  <span className="text-xs text-muted-foreground">{validation.description ? 'Added' : 'Optional'}</span>
                </li>
                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40">
                  <span className="flex items-center text-foreground font-medium">
                    {validation.image ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <Info className="w-4 h-4 text-blue-500 mr-2" />}
                    Featured Image
                  </span>
                  <span className="text-xs text-muted-foreground">{validation.image ? 'Added' : 'Optional'}</span>
                </li>
              </ul>
            </div>

            {/* Tips Card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-6 focus:outline-none hover:bg-muted/50 transition-colors"
                onClick={() => setShowTips(!showTips)}
              >
                <h3 className="flex items-center text-lg font-semibold text-foreground">
                  <Info className="w-5 h-5 mr-2" /> 
                  Publishing Tips
                </h3>
                {showTips ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>
              
              {showTips && (
                <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-4 duration-200">
                  <ul className="space-y-4">
                    {publishingTips.map((tip, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md h-fit">
                          {tip.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{tip.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tip.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Snackbar notification */}
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 rounded-lg shadow-lg border p-4 max-w-sm w-full animate-in slide-in-from-bottom flex items-start gap-3 ${
          snackbar.severity === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-500'
        }`}>
          {snackbar.severity === 'error' ? (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{snackbar.severity === 'error' ? 'Error' : 'Success'}</h4>
            <p className="text-sm opacity-90">{snackbar.message}</p>
          </div>
          <button 
            onClick={() => setSnackbar({ ...snackbar, open: false })}
            className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;