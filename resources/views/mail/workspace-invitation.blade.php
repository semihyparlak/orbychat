@php
    /** @var \App\Models\Invitation $invitation */
@endphp
<x-mail::message>
# You're invited to join {{ $invitation->workspace->name }}

You've been invited to join the **{{ $invitation->workspace->name }}** workspace on {{ config('app.name') }} as a **{{ $invitation->role }}**.

<x-mail::button :url="$acceptUrl">
Accept invitation
</x-mail::button>

This invitation expires on {{ $invitation->expires_at->toFormattedDateString() }}.

Thanks,
{{ config('app.name') }}
</x-mail::message>
