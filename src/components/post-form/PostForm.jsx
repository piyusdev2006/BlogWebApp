import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "..";
import dbService from "../../appwriteServices/dbServices";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
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
    const { image, ...postData } = data;

    if (post) {
      const file = image?.[0] ? await dbService.uploadFile(image[0]) : null;

      const dbPostUpdate = await dbService.updatePost(post.$id, {
        ...postData,
        featuredImage: file ? file.$id : post.featuredImage,
        userId: post.userId,
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
        userId: userData.$id,
        featuredImage: file ? file.$id : "",
      });

      if (newPost) {
        navigate(`/post/${newPost.$id}`);
      }
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
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  // Live preview for the selected image file
  const imageFile = watch("image");
  const imagePreview = imageFile?.[0]
    ? URL.createObjectURL(imageFile[0])
    : null;

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-6 page-enter">
      {/* Main content — left */}
      <div className="flex-1 space-y-5">
        <Input
          label="Title"
          placeholder="Enter your post title..."
          {...register("title", { required: true })}
        />
        <Input
          label="Slug"
          placeholder="auto-generated-slug"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* Sidebar — right */}
      <div className="w-full lg:w-80 space-y-5">
        {/* Image upload card */}
        <div className="bg-surface-1 rounded-lg border border-hairline p-5 space-y-4">
          <h3 className="text-body-sm text-ink-muted font-medium">Featured Image</h3>
          <Input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image")}
          />

          {/* Show preview of selected new image, or existing post image while editing */}
          {(imagePreview || post?.featuredImage) && (
            <div className="w-full rounded-xl overflow-hidden border border-hairline">
              <img
                src={
                  imagePreview ||
                  dbService.getFileView(post.featuredImage)
                }
                alt={post?.title || "preview"}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* Settings card */}
        <div className="bg-surface-1 rounded-lg border border-hairline p-5 space-y-4">
          <h3 className="text-body-sm text-ink-muted font-medium">Settings</h3>
          <Select
            options={["active", "inactive"]}
            label="Status"
            {...register("status", { required: true })}
          />
          <Button
            type="submit"
            variant={post ? "primary" : "primary"}
            className="w-full"
          >
            {post ? "Update Post" : "Publish Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
