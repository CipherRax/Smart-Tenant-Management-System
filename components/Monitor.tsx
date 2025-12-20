// app/components/CCTVMonitor.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  StopCircle, 
  Plus, 
  Trash2, 
  Settings,
  Video,
  AlertCircle
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

// TypeScript interfaces
interface Camera {
  id: string;
  name: string;
  streamUrl: string;
  status: 'connected' | 'disconnected' | 'error';
  lastActive?: string;
}

interface CameraForm {
  name: string;
  protocol: 'rtsp' | 'http' | 'https';
  host: string;
  port: string;
  path: string;
  username: string;
  password: string;
}

// Helper to construct stream URL
const buildStreamUrl = (form: CameraForm): string => {
  const auth = form.username && form.password 
    ? `${encodeURIComponent(form.username)}:${encodeURIComponent(form.password)}@` 
    : '';
  return `${form.protocol}://${auth}${form.host}:${form.port}${form.path}`;
};

// Main Component
export default function CCTVMonitor() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [form, setForm] = useState<CameraForm>({
    name: '',
    protocol: 'rtsp',
    host: '',
    port: '554',
    path: '',
    username: '',
    password: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Load cameras from localStorage on mount (for demo persistence)
  useEffect(() => {
    const saved = localStorage.getItem('cctv-cameras');
    if (saved) {
      try {
        setCameras(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved cameras');
      }
    }
  }, []);

  // Save cameras to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cctv-cameras', JSON.stringify(cameras));
  }, [cameras]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  // Validate and add new camera
  const handleAddCamera = () => {
    setFormError(null);
    
    // Basic validation
    if (!form.name.trim()) {
      setFormError('Camera name is required');
      return;
    }
    if (!form.host.trim()) {
      setFormError('Host/IP address is required');
      return;
    }
    if (isNaN(Number(form.port)) || Number(form.port) <= 0) {
      setFormError('Valid port is required');
      return;
    }

    const cameraId = `cam_${Date.now()}`;
    const streamUrl = buildStreamUrl(form);
    const newCamera: Camera = {
      id: cameraId,
      name: form.name,
      streamUrl,
      status: 'disconnected'
    };

    setCameras(prev => [...prev, newCamera]);
    setIsAddingCamera(false);
    resetForm();
  };

  // Remove a camera
  const handleRemoveCamera = (id: string) => {
    setCameras(prev => prev.filter(cam => cam.id !== id));
    if (activeCameraId === id) {
      setActiveCameraId(null);
    }
  };

  // Connect to camera stream
  const handleConnect = (id: string) => {
    const camera = cameras.find(c => c.id === id);
    if (!camera) return;

    const video = videoRefs.current[id];
    if (!video) return;

    video.src = camera.streamUrl;
    video.load();
    
    // Update status after attempting connection
    setCameras(prev => 
      prev.map(cam => 
        cam.id === id ? { ...cam, status: 'connected', lastActive: new Date().toISOString() } : cam
      )
    );
    setActiveCameraId(id);
  };

  // Disconnect from camera
  const handleDisconnect = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.src = '';
      video.load();
    }
    
    setCameras(prev => 
      prev.map(cam => 
        cam.id === id ? { ...cam, status: 'disconnected' } : cam
      )
    );
    if (activeCameraId === id) {
      setActiveCameraId(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: '',
      protocol: 'rtsp',
      host: '',
      port: '554',
      path: '',
      username: '',
      password: ''
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CCTV Monitoring Dashboard</h1>
        <Dialog open={isAddingCamera} onOpenChange={setIsAddingCamera}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New IP Camera</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Living Room Camera"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="protocol" className="text-right">
                  Protocol
                </Label>
                <Select 
                  value={form.protocol} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, protocol: value as any }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rtsp">RTSP</SelectItem>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="https">HTTPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="host" className="text-right">
                  Host/IP
                </Label>
                <Input
                  id="host"
                  name="host"
                  value={form.host}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="192.168.1.100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  Port
                </Label>
                <Input
                  id="port"
                  name="port"
                  value={form.port}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="554"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="path" className="text-right">
                  Stream Path
                </Label>
                <Input
                  id="path"
                  name="path"
                  value={form.path}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="/stream1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              {formError && (
                <div className="col-span-4 text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {formError}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingCamera(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCamera}>Add Camera</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {cameras.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No cameras added yet</p>
            <Button 
              className="mt-4" 
              onClick={() => setIsAddingCamera(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Camera
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <Card key={camera.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{camera.name}</CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveCamera(camera.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`h-3 w-3 rounded-full mr-2 ${
                    camera.status === 'connected' ? 'bg-green-500' : 
                    camera.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></span>
                  <span className="text-sm capitalize">
                    {camera.status}
                    {camera.lastActive && camera.status === 'connected' && 
                      ` • ${new Date(camera.lastActive).toLocaleTimeString()}`
                    }
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video">
                  <video
                    ref={el => { videoRefs.current[camera.id] = el; }}
                    className="w-full h-full object-contain"
                    controls={false}
                    autoPlay
                    muted
                    playsInline
                  />
                  {camera.status !== 'connected' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center text-white">
                        <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {camera.status === 'disconnected' 
                            ? 'Not connected' 
                            : 'Stream error'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 flex gap-2">
                  {camera.status === 'connected' ? (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDisconnect(camera.id)}
                    >
                      <StopCircle className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleConnect(camera.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                  <Button size="icon" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}