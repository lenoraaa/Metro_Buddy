export class AudioContextManager {
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private isRecording: boolean = false;

    constructor() { }

    async startRecording(): Promise<void> {
        if (typeof window === 'undefined') return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.chunks = [];

            this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
                if (e.data.size > 0) {
                    this.chunks.push(e.data);
                }
            };

            this.mediaRecorder.start();
            this.isRecording = true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            throw error;
        }
    }

    async stopRecording(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder || !this.isRecording) {
                resolve("");
                return;
            }

            this.mediaRecorder.onstop = async () => {
                const blob = new Blob(this.chunks, { type: 'audio/webm' });
                const base64 = await this.blobToBase64(blob);
                this.streamCleanup();
                resolve(base64);
            };

            this.mediaRecorder.stop();
            this.isRecording = false;
        });
    }

    private streamCleanup() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.mediaRecorder = null;
        }
    }

    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove data URL prefix for API
                resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}
