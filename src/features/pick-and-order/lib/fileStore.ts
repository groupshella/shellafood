// src/features/pick-and-order/lib/fileStore.ts
// Module-level singleton — survives client-side navigation, lost only on full page refresh

const store = {
    stopPhotos:    new Map<number, File>(),
    packageImages: [] as File[],
  };
  
  export const FileStore = {
    setStopPhoto(stopOrder: number, file: File | null) {
      if (file) store.stopPhotos.set(stopOrder, file);
      else      store.stopPhotos.delete(stopOrder);
    },
  
    setPackageImages(files: File[]) {
      store.packageImages = files;
    },
  
    getStopPhotos():    Map<number, File> { return store.stopPhotos;    },
    getPackageImages(): File[]            { return store.packageImages; },
  
    clear() {
      store.stopPhotos    = new Map();
      store.packageImages = [];
    },
  };