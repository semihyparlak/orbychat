import { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MoreHorizontal,
    Plus,
    User,
    Loader2,
    Settings,
    Check,
} from 'lucide-react';
import { __ } from '@/app';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Appointment {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    appointment_at: string;
    reason: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    agent: {
        id: string;
        name: string;
    };
}

interface Agent {
    id: string;
    name: string;
}

interface Workspace {
    id: string;
    settings: any;
}

interface Props {
    appointments: Appointment[];
    agents: Agent[];
    workspace: Workspace;
    timezones: string[];
}

export default function CalendarPage({ appointments, agents, workspace, timezones }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const calendarSettings = workspace.settings?.calendar || {
        working_days: [1, 2, 3, 4, 5],
        working_hours_start: '09:00',
        working_hours_end: '17:00',
        timezone: 'UTC',
        slot_duration: 30,
        buffer_time: 120,
        require_kvkk: true,
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        agent_id: agents[0]?.id || '',
        name: '',
        email: '',
        phone: '',
        appointment_at: '',
        reason: '',
    });

    const settingsForm = useForm({
        working_days: calendarSettings.working_days || [1, 2, 3, 4, 5],
        working_hours_start: calendarSettings.working_hours_start || '09:00',
        working_hours_end: calendarSettings.working_hours_end || '17:00',
        timezone: calendarSettings.timezone || 'UTC',
        slot_duration: calendarSettings.slot_duration || 30,
        buffer_time: calendarSettings.buffer_time || 0,
        require_kvkk: calendarSettings.require_kvkk ?? false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/app/calendar', {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                reset();
                toast.success(__('Appointment created successfully.'));
            },
        });
    };

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.post('/app/calendar/settings', {
            onSuccess: () => {
                setIsSettingsDialogOpen(false);
                toast.success(__('Settings updated successfully.'));
            },
        });
    };

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const monthNames = [
        __("January"), __("February"), __("March"), __("April"), __("May"), __("June"),
        __("July"), __("August"), __("September"), __("October"), __("November"), __("December")
    ];

    const days = [];
    const totalDays = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    // Add empty slots for days of previous month
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }

    // Add days of current month
    for (let i = 1; i <= totalDays; i++) {
        days.push(new Date(year, month, i));
    }

    const getAppointmentsForDate = (date: Date) => {
        return appointments.filter(app => {
            const appDate = new Date(app.appointment_at);
            return appDate.getDate() === date.getDate() &&
                   appDate.getMonth() === date.getMonth() &&
                   appDate.getFullYear() === date.getFullYear();
        });
    };

    const breadcrumbs = [
        { title: __('Calendar'), href: '/app/calendar' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Calendar')} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{__('Calendar')}</h1>
                        <p className="text-muted-foreground">{__('Manage your upcoming appointments and bookings.')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Settings className="size-4" />
                                    {__('Settings')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={submitSettings}>
                                    <DialogHeader>
                                        <DialogTitle>{__('Calendar Settings')}</DialogTitle>
                                        <DialogDescription>
                                            {__('Define your workspace working hours and days.')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>{__('Working Days')}</Label>
                                            <div className="flex flex-wrap gap-4 pt-2">
                                                {[
                                                    { id: 1, label: __('Mon') },
                                                    { id: 2, label: __('Tue') },
                                                    { id: 3, label: __('Wed') },
                                                    { id: 4, label: __('Thu') },
                                                    { id: 5, label: __('Fri') },
                                                    { id: 6, label: __('Sat') },
                                                    { id: 0, label: __('Sun') },
                                                ].map((day) => (
                                                    <div key={day.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`day-${day.id}`}
                                                            checked={settingsForm.data.working_days.includes(day.id)}
                                                            onCheckedChange={(checked) => {
                                                                const days = [...settingsForm.data.working_days];
                                                                if (checked) {
                                                                    days.push(day.id);
                                                                } else {
                                                                    const index = days.indexOf(day.id);
                                                                    if (index > -1) days.splice(index, 1);
                                                                }
                                                                settingsForm.setData('working_days', days);
                                                            }}
                                                        />
                                                        <Label htmlFor={`day-${day.id}`} className="text-sm font-normal cursor-pointer">
                                                            {day.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="start">{__('Start Time')}</Label>
                                                <Input
                                                    id="start"
                                                    type="time"
                                                    value={settingsForm.data.working_hours_start}
                                                    onChange={(e) => settingsForm.setData('working_hours_start', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="end">{__('End Time')}</Label>
                                                <Input
                                                    id="end"
                                                    type="time"
                                                    value={settingsForm.data.working_hours_end}
                                                    onChange={(e) => settingsForm.setData('working_hours_end', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="timezone">{__('Timezone')}</Label>
                                            <Select
                                                value={settingsForm.data.timezone}
                                                onValueChange={(value) => settingsForm.setData('timezone', value)}
                                            >
                                                <SelectTrigger id="timezone">
                                                    <SelectValue placeholder={__('Select timezone')} />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {timezones.map((tz) => (
                                                        <SelectItem key={tz} value={tz}>
                                                            {tz}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {settingsForm.errors.timezone && (
                                                <p className="text-sm text-destructive">{settingsForm.errors.timezone}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="slot_duration">{__('Slot Duration (min)')}</Label>
                                                <Input
                                                    id="slot_duration"
                                                    type="number"
                                                    value={settingsForm.data.slot_duration}
                                                    onChange={(e) => settingsForm.setData('slot_duration', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="buffer_time">{__('Buffer Time (min)')}</Label>
                                                <Input
                                                    id="buffer_time"
                                                    type="number"
                                                    value={settingsForm.data.buffer_time}
                                                    onChange={(e) => settingsForm.setData('buffer_time', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="require_kvkk"
                                                checked={settingsForm.data.require_kvkk}
                                                onCheckedChange={(checked) => settingsForm.setData('require_kvkk', !!checked)}
                                            />
                                            <Label htmlFor="require_kvkk" className="text-sm font-medium leading-none cursor-pointer">
                                                {__('Require GDPR/KVKK consent checkbox')}
                                            </Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                                            {__('Cancel')}
                                        </Button>
                                        <Button type="submit" disabled={settingsForm.processing}>
                                            {settingsForm.processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                            {__('Save Settings')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="size-4" />
                                {__('Add Appointment')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={submit}>
                                <DialogHeader>
                                    <DialogTitle>{__('Add Appointment')}</DialogTitle>
                                    <DialogDescription>
                                        {__('Schedule a new appointment for your workspace.')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="agent_id">{__('Agent')}</Label>
                                        <Select
                                            value={data.agent_id}
                                            onValueChange={(value) => setData('agent_id', value)}
                                        >
                                            <SelectTrigger id="agent_id">
                                                <SelectValue placeholder={__('Select an agent')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agents.map((agent) => (
                                                    <SelectItem key={agent.id} value={agent.id}>
                                                        {agent.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.agent_id && <p className="text-sm text-destructive">{errors.agent_id}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">{__('Name')}</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">{__('Email')}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="appointment_at">{__('Date & Time')}</Label>
                                        <Input
                                            id="appointment_at"
                                            type="datetime-local"
                                            value={data.appointment_at}
                                            onChange={(e) => setData('appointment_at', e.target.value)}
                                        />
                                        {errors.appointment_at && <p className="text-sm text-destructive">{errors.appointment_at}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">{__('Reason (Optional)')}</Label>
                                        <Textarea
                                            id="reason"
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            placeholder={__('Brief description of the appointment')}
                                        />
                                        {errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        {__('Cancel')}
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                        {__('Save Appointment')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Calendar Grid */}
                    <Card className="lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xl font-bold">
                                {__(monthNames[month])} {year}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={prevMonth}>
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                                    {__('Today')}
                                </Button>
                                <Button variant="outline" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-muted/50 border">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="bg-background py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                                        {__(day)}
                                    </div>
                                ))}
                                {days.map((date, i) => {
                                    const dayAppointments = date ? getAppointmentsForDate(date) : [];
                                    const isToday = date && date.toDateString() === new Date().toDateString();

                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/30",
                                                !date && "bg-muted/10"
                                            )}
                                        >
                                            {date && (
                                                <>
                                                    <span className={cn(
                                                        "inline-flex size-7 items-center justify-center rounded-full text-sm font-medium",
                                                        isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                                                    )}>
                                                        {date.getDate()}
                                                    </span>
                                                    <div className="mt-2 space-y-1">
                                                        {dayAppointments.slice(0, 3).map(app => (
                                                            <div
                                                                key={app.id}
                                                                className={cn(
                                                                    "group flex flex-col rounded-md border px-2 py-1 text-[10px] leading-tight",
                                                                    app.status === 'confirmed' ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" :
                                                                    app.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400" :
                                                                    "bg-muted border-muted-foreground/10 text-muted-foreground"
                                                                )}
                                                            >
                                                                <span className="font-semibold truncate">{app.name}</span>
                                                                <span className="flex items-center gap-1 opacity-80">
                                                                    <Clock className="size-3" />
                                                                    {new Date(app.appointment_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: calendarSettings.timezone })}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {dayAppointments.length > 3 && (
                                                            <div className="text-[10px] text-muted-foreground text-center font-medium">
                                                                + {dayAppointments.length - 3} {__('more')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming List */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{__('Upcoming')}</CardTitle>
                                <CardDescription>{__('Next 7 days')}</CardDescription>
                            </CardHeader>
                            <CardContent className="px-2">
                                <div className="space-y-4">
                                    {appointments.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                            <CalendarIcon className="mb-2 size-8 opacity-20" />
                                            <p className="text-sm">{__('No upcoming appointments')}</p>
                                        </div>
                                    ) : (
                                        appointments.slice(0, 5).map(app => (
                                            <div key={app.id} className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <User className="size-5" />
                                                </div>
                                                <div className="flex flex-1 flex-col min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold truncate">{app.name}</span>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-7">
                                                                    <MoreHorizontal className="size-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedAppointment(app);
                                                                    setIsDetailsOpen(true);
                                                                }}>
                                                                    {__('View Details')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast.info(__('Reschedule feature coming soon.'))}>
                                                                    {__('Reschedule')}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="text-destructive"
                                                                    onClick={() => {
                                                                        if (confirm(__('Are you sure you want to cancel this appointment?'))) {
                                                                            post(`/app/calendar/${app.id}/cancel`, {
                                                                                onSuccess: () => toast.success(__('Appointment cancelled.')),
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    {__('Cancel')}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <CalendarIcon className="size-3" />
                                                        {new Date(app.appointment_at).toLocaleDateString(undefined, { timeZone: calendarSettings.timezone })}
                                                        <Clock className="size-3 ml-1" />
                                                        {new Date(app.appointment_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: calendarSettings.timezone })}
                                                    </span>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className={cn(
                                                            "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                                                            app.status === 'confirmed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                                            app.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                                                            "bg-muted text-muted-foreground"
                                                        )}>
                                                            {__(app.status)}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground truncate italic">
                                                            via {app.agent.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{__('Appointment Details')}</DialogTitle>
                        <DialogDescription>
                            {__('View full information for this booking.')}
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedAppointment && (
                        <div className="grid gap-6 py-4">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="size-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold">{selectedAppointment.name}</span>
                                    <span className="text-sm text-muted-foreground">{selectedAppointment.email || __('No email provided')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">{__('Date')}</Label>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <CalendarIcon className="size-4 text-primary" />
                                        {new Date(selectedAppointment.appointment_at).toLocaleDateString(undefined, { timeZone: calendarSettings.timezone })}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">{__('Time')}</Label>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="size-4 text-primary" />
                                        {new Date(selectedAppointment.appointment_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: calendarSettings.timezone })}
                                    </div>
                                </div>
                            </div>

                            {selectedAppointment.phone && (
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">{__('Phone')}</Label>
                                    <div className="text-sm font-medium">{selectedAppointment.phone}</div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground uppercase">{__('Agent / Department')}</Label>
                                <div className="text-sm font-medium">{selectedAppointment.agent.name}</div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase">{__('Status')}</Label>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                                        selectedAppointment.status === 'confirmed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                                        selectedAppointment.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                                        "bg-muted text-muted-foreground"
                                    )}>
                                        {__(selectedAppointment.status)}
                                    </span>
                                    
                                    {selectedAppointment.status === 'pending' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-7 text-[10px]"
                                            onClick={() => {
                                                post(`/app/calendar/${selectedAppointment.id}/confirm`, {
                                                    onSuccess: () => {
                                                        setIsDetailsOpen(false);
                                                        toast.success(__('Appointment confirmed.'));
                                                    }
                                                });
                                            }}
                                        >
                                            <Check className="mr-1 size-3" />
                                            {__('Confirm Now')}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {selectedAppointment.reason && (
                                <div className="space-y-1 border-t pt-4">
                                    <Label className="text-xs text-muted-foreground uppercase">{__('Note / Reason')}</Label>
                                    <div className="text-sm leading-relaxed text-muted-foreground bg-muted/20 p-3 rounded-md italic">
                                        "{selectedAppointment.reason}"
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDetailsOpen(false)}>
                            {__('Close')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
