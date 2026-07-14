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
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image")}
        />

        {/* Show preview of selected new image, or existing post image while editing */}
        {(imagePreview || post?.featuredImage) && (
          <div className="w-full mb-4">
            <img
              src={
                imagePreview ||
                dbService.getFileView(post.featuredImage)
              }
              alt={post?.title || "preview"}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
