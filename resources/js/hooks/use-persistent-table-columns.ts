import { useEffect, useRef, useState } from 'react';

export type TableColumnOption<Id extends string> = {
    id: Id;
    label: string;
    canHide?: boolean;
    defaultVisible?: boolean;
};

function normalizeVisibleColumns<Id extends string>(
    columns: readonly TableColumnOption<Id>[],
    candidateIds: Iterable<Id>,
): Id[] {
    const visibleSet = new Set(candidateIds);

    columns.forEach((column) => {
        if (column.canHide === false) {
            visibleSet.add(column.id);
        }
    });

    const orderedVisibleColumns = columns
        .filter((column) => visibleSet.has(column.id))
        .map((column) => column.id);

    if (orderedVisibleColumns.length > 0) {
        return orderedVisibleColumns;
    }

    return columns
        .filter((column) => column.defaultVisible !== false)
        .map((column) => column.id);
}

function getDefaultVisibleColumns<Id extends string>(
    columns: readonly TableColumnOption<Id>[],
): Id[] {
    return columns
        .filter((column) => column.defaultVisible !== false)
        .map((column) => column.id);
}

export function usePersistentTableColumns<Id extends string>(
    storageKey: string,
    columns: readonly TableColumnOption<Id>[],
) {
    const defaultVisibleColumns = getDefaultVisibleColumns(columns);

    const [visibleColumns, setVisibleColumns] = useState<Id[]>(
        defaultVisibleColumns,
    );
    const hasLoadedPreferences = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const fallbackColumns = getDefaultVisibleColumns(columns);
        const storedColumns = window.localStorage.getItem(storageKey);

        if (!storedColumns) {
            hasLoadedPreferences.current = true;

            return;
        }

        let cancelled = false;

        try {
            const parsedColumns = JSON.parse(storedColumns);

            if (!Array.isArray(parsedColumns)) {
                hasLoadedPreferences.current = true;

                return;
            }

            const knownColumnIds = columns.map((column) => column.id);
            const nextVisibleColumns = parsedColumns.filter(
                (columnId): columnId is Id => knownColumnIds.includes(columnId),
            );

            queueMicrotask(() => {
                if (cancelled) {
                    return;
                }

                hasLoadedPreferences.current = true;
                setVisibleColumns(
                    normalizeVisibleColumns(columns, nextVisibleColumns),
                );
            });
        } catch {
            queueMicrotask(() => {
                if (cancelled) {
                    return;
                }

                hasLoadedPreferences.current = true;
                setVisibleColumns(fallbackColumns);
            });
        }

        return () => {
            cancelled = true;
        };
    }, [columns, storageKey]);

    useEffect(() => {
        if (typeof window === 'undefined' || !hasLoadedPreferences.current) {
            return;
        }

        window.localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    }, [storageKey, visibleColumns]);

    const setColumnVisibility = (id: Id, visible: boolean) => {
        const column = columns.find((entry) => entry.id === id);

        if (!column || column.canHide === false) {
            return;
        }

        setVisibleColumns((currentColumns) => {
            const nextColumns = new Set(currentColumns);

            if (visible) {
                nextColumns.add(id);
            } else {
                nextColumns.delete(id);
            }

            return normalizeVisibleColumns(columns, nextColumns);
        });
    };

    return {
        visibleColumns,
        hiddenColumnCount: columns.length - visibleColumns.length,
        isColumnVisible: (id: Id) => visibleColumns.includes(id),
        resetColumns: () =>
            setVisibleColumns(getDefaultVisibleColumns(columns)),
        setColumnVisibility,
    };
}
