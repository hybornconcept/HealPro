<script>
  import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "$lib/components/ui/avatar";
</script>
<section class="w-full bg-blue-50 px-6 py-20">
  <div class="mx-auto max-w-5xl px-6">
    <div class="mx-auto max-w-4xl text-center space-y-6">
    	<div class=" inline-flex items-center rounded-md bg-blue-50 border border-gray-100 px-3 py-1 text-[0.8rem] font-semibold text-blue-700 shadow-sm">
				<span class="mr-1.5 text-blue-500 font-bold ">-</span> Our Mission
			</div>
      <blockquote>
        <p class="text-lg font-medium sm:text-xl md:text-3xl ">

          To bridge the gap between healthcare and technology, empowering
          healthcare professionals to redefine digital boundaries through seamless innovation. We
          craft elegant experiences that resonate deeply, fostering a future where
          technology inspires.
        </p>

        <div class="mt-12 flex items-center justify-center gap-6">
          <Avatar class="size-12 ring-1 ring-blue-600 ring-offset-2">
            <AvatarImage
              src="https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=200&h=200&auto=format&fit=crop"
              alt="Founder"
            />
            <AvatarFallback>KO</AvatarFallback>
          </Avatar>
          <div class="text-left">
            <p class="text-base font-bold text-gray-900 leading-none">Kenneth Odey</p>
            <p class="text-sm text-blue-600 font-medium mt-1">Founder, HealPro</p>
          </div>
        </div>
      </blockquote>
    </div>
  </div>
</section>
