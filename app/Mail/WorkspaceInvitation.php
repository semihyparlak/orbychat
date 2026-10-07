<?php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WorkspaceInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Invitation $invitation) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You have been invited to '.$this->invitation->workspace->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.workspace-invitation',
            with: [
                'invitation' => $this->invitation,
                'acceptUrl' => url('/invitations/'.$this->invitation->token),
            ],
        );
    }
}
