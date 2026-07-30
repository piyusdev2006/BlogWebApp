import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "..";
import dbService from "../../appwriteServices/dbServices";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { image, ...postData } = data;

      if (post) {
        const file = image?.[0] ? await dbService.uploadFile(image[0]) : null;

        const dbPostUpdate = await dbService.updatePost(post.$id, {
          ...postData,
          featuredImage: file ? file.$id : post.featuredImage,
          userId: post.userId || userData?.$id,
        });

        if (dbPostUpdate) {
          if (file && post.featuredImage) {
            await dbService.deleteFile(post.featuredImage);
          }
          navigate(`/post/${dbPostUpdate.$id}`);
        }
      } else {
        const file = image?.[0] ? await dbService.uploadFile(image[0]) : null;

        const newPost = await dbService.createPost({
          ...postData,
          userId: userData?.$id || "anonymous",
          featuredImage: file ? file.$id : "",
        });

        if (newPost) {
          navigate(`/post/${newPost.$id}`);
        }
      }
    } catch (err) {
      setErrorMessage(err?.message || "Failed to save document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && !post) {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue, post]);

  // Live preview for the selected image file
  const imageFile = watch("image");
  const imagePreview = imageFile?.[0]
    ? URL.createObjectURL(imageFile[0])
    : null;

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-8 page-enter">
      {/* Main content — left */}
      <div className="flex-1 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-body-sm flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. Getting Started with React 19 Server Components"
            {...register("title", { required: true })}
          />

          <div className="space-y-1">
            <Input
              label="URL Slug"
              placeholder="getting-started-react-19"
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }}
            />
            <p className="text-[11px] font-mono text-ink-tertiary pl-1">
              Permalink: /post/<span className="text-primary font-medium">{watch("slug") || "your-slug"}</span>
            </p>
          </div>
        </div>

        <RTE
          label="Document Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* Sidebar — right */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Image upload card */}
        <div className="bg-surface-1 rounded-xl border border-hairline p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-body-sm text-ink-muted font-medium">Featured Image</h3>
            <span className="text-caption text-ink-tertiary">Optional</span>
          </div>
          
          <Input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image")}
            className="text-caption"
          />

          {/* Show preview of selected new image, or existing post image while editing */}
          {(imagePreview || (post?.featuredImage && post.featuredImage.trim() !== "")) && (
            <div className="relative rounded-lg overflow-hidden border border-hairline bg-surface-2 group">
              <img
                src={
                  imagePreview ||
                  dbService.getFileView(post.featuredImage)
                }
                alt={post?.title || "preview"}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-canvas/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-caption text-ink font-mono bg-surface-1 px-2 py-1 rounded border border-hairline">
                  Preview Image
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Settings & Actions card */}
        <div className="bg-surface-1 rounded-xl border border-hairline p-5 space-y-5 shadow-lg">
          <h3 className="text-body-sm text-ink-muted font-medium border-b border-hairline pb-2">Publish Options</h3>
          
          <Select
            options={["active", "inactive"]}
            label="Visibility Status"
            {...register("status", { required: true })}
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Document...
              </span>
            ) : post ? (
              "Update Document"
            ) : (
              "Publish Document"
            )}
          </Button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-2 rounded-md text-button font-medium text-ink-subtle hover:text-ink transition-colors cursor-pointer text-center text-caption"
          >
            Cancel and Go Back
          </button>
        </div>
      </div>
    </form>
  );
}

