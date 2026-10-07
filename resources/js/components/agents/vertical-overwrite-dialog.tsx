import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { VERTICAL_BY_ID } from '@/lib/verticals';
import type { VerticalId } from '@/lib/verticals';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    targetVertical: VerticalId | null;
    onConfirm: () => void;
    pending?: boolean;
};

/**
 * Confirmation dialog before destructively overwriting an admin's
 * customized starter prompts / launcher label / max_chars with a
 * preset's defaults. Non-destructive applies skip this.
 */
export function VerticalOverwriteDialog({
    open,
    onOpenChange,
    targetVertical,
    onConfirm,
    pending = false,
}: Props) {
    const meta = targetVertical ? VERTICAL_BY_ID[targetVertical] : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {__('Apply the :name preset?', { name: meta?.name ?? __('this') })}
                    </DialogTitle>
                    <DialogDescription>
                        {__("This will replace your current starter prompts, launcher label, and reply length with the preset's defaults. Theme, name, language, and your custom system prompt are not affected.")}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={pending}
                    >
                        {__('Cancel')}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={pending || !targetVertical}
                    >
                        {pending ? __('Applying...') : __('Replace and apply')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
