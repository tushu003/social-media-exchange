// _components/user-avater.jsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export function UserAvatar({ user, size = 40 }) {
  // Accept the entire user object, not just profileImage
  // Handle both cases: when user is the full object or just the profileImage string
  const isFullUserObject = typeof user === 'object' && user !== null;
  
  // Determine the image URL
  let fullImageUrl = null;
  if (isFullUserObject && user.profileImage) {
    fullImageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profileImage}`;
  } else if (typeof user === 'string') {
    fullImageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${user}`;
  }
  
  // Determine initials
  const initials = isFullUserObject && user.first_name 
    ? user.first_name.slice(0, 2).toUpperCase()
    : "UN";

  // Use fixed size classes instead of dynamic template literals
  const sizeClass = size === 40 ? "h-10 w-10" : 
                   size === 96 ? "h-24 w-24" : 
                   size === 32 ? "h-8 w-8" : "h-10 w-10";
  
  return (
    <Avatar className={sizeClass}>
      {fullImageUrl ? (
        <Image 
          src={fullImageUrl} 
          alt={isFullUserObject && user.first_name ? user.first_name : "User"} 
          width={size} 
          height={size}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[#20B894] flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
      )}
    </Avatar>
  );
}