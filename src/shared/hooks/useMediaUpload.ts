import { useCallback, useEffect, useRef, useState } from "react";
import { MEDIA_LIMITS } from "@/features/serve-me/constants/serve-me.constants";
import { validateVideoDuration, validateVideoSize, validateVideoType } from "@/shared/lib/utils";

export default function useMediaUpload() {
	// Voice recording state

	const [isRecording, setIsRecording] = useState(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [recordingTime, setRecordingTime] = useState(0);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
	const [images, setImages] = useState<string[]>([]);
	const [video, setVideo] = useState<string | null>(null);
	const [voice, setVoice] = useState<string | null>(null);



	const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages: string[] = [];
		const maxFiles = Math.min(files.length, MEDIA_LIMITS.MAX_IMAGES - images.length);

		for (let i = 0; i < maxFiles; i++) {
			const file = files[i];
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					newImages.push(reader.result as string);
					if (newImages.length === maxFiles) {
						const updatedImages = [...images, ...newImages];
						setImages(updatedImages);
					}
				}
			};
			reader.readAsDataURL(file);
		}
	}, [images]);

	const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!validateVideoType(file)) {
			alert("نوع الملف غير مدعوم. يرجى رفع ملف فيديو بصيغة MP4, MOV, أو WEBM.");
			e.target.value = '';
			return;
		}

		// Validate file size
		if (!validateVideoSize(file)) {
			alert("حجم الملف كبير جداً. الحد الأقصى هو 50 ميجابايت.");
			e.target.value = '';
			return;
		}

		// Validate video duration
		try {
			const isValidDuration = await validateVideoDuration(file);
			if (!isValidDuration) {
				alert("مدة الفيديو طويلة جداً. الحد الأقصى هو 30 ثانية.");
				e.target.value = '';
				return;
			}

			// If validation passes, read and set video
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					setVideo(reader.result as string);
				}
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Error validating video:', error);
			alert("خطأ في التحقق من ملف الفيديو. يرجى المحاولة مرة أخرى.");
			e.target.value = '';
		}
	}, []);

	const startRecording = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
				const url = URL.createObjectURL(audioBlob);
				setAudioURL(url);

				// Convert to Base64
				const reader = new FileReader();
				reader.onloadend = () => {
					if (reader.result) {
						setVoice(reader.result as string);
					}
				};
				reader.readAsDataURL(audioBlob);

				// Stop all tracks
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);

			// Start timer
			recordingTimerRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		} catch (error) {
			console.error("Error starting recording:", error);
			alert("خطأ في بدء التسجيل. يرجى التحقق من الصلاحيات.");
		}
	}, []);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			if (recordingTimerRef.current) {
				clearInterval(recordingTimerRef.current);
				recordingTimerRef.current = null;
			}
		}
	}, [isRecording]);

	const removeImage = useCallback((index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
	}, [images]);

	const removeVideo = useCallback(() => {
		setVideo(null);
	}, []);

	const removeVoice = useCallback(() => {
		setVoice(null);
		setAudioURL(null);
		setRecordingTime(0);
	}, []);


	return {
		removeVoice,
		removeVideo,
		removeImage,
		stopRecording,
		startRecording,
		handleImageUpload,
		handleVideoUpload,
		images,
		video,
		recordingTime,
		isRecording,
		voice,
		audioURL
	};


}
